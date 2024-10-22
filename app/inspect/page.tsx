"use client";
import React, {useEffect, useState} from "react";

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {gql, request} from 'graphql-request';
import {Pie} from 'react-chartjs-2';
import {formatEther} from "viem";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

const QUERY_DOCUMENT = gql`
    {
        Account(order_by: {db_write_timestamp: desc_nulls_last}) {
            balance
            id
            stakedNFTs {
                active
                amount
                timestamp
                tokenId
            }
        }
    }
`;

export type Account = {
    balance: string;
    id: string;
    stakedNFTs: Array<{
        active: boolean;
        amount: string;
        timestamp: string;
        tokenId: string;
    }>;
};

const CHART_COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#FF8A80', '#82B1FF', '#B9F6CA', '#FFFF8D', '#FF80AB', '#EA80FC'
];

export default function InsightPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'balance' | 'stakedNFTs'>('balance');
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await request('https://indexer.bigdevenergy.link/92f8c3e/v1/graphql/', QUERY_DOCUMENT);

                // @ts-ignore
                setAccounts(data.Account);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingSkeleton/>;
    }

    const filteredAccounts = accounts.filter(account =>
        account.id.toLowerCase().includes(filterValue.toLowerCase()) ||
        formatEther(BigInt(account.balance)).includes(filterValue)
    );

    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
        if (sortBy === 'balance') {
            return parseFloat(b.balance) - parseFloat(a.balance);
        } else {
            return b.stakedNFTs.length - a.stakedNFTs.length;
        }
    });

    const accountBalances = sortedAccounts.map(account => ({
        id: account.id,
        balance: parseFloat(formatEther(BigInt(account.balance)))
    }));

    const chartData = {
        labels: accountBalances.map(account => `${account.id.slice(0, 6)}...${account.id.slice(-4)}`),
        datasets: [{
            data: accountBalances.map(account => account.balance),
            backgroundColor: CHART_COLORS,
            hoverBackgroundColor: CHART_COLORS.map(color => color + 'CC'),
        }],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toFixed(2)} $COMMONS`;
                    },
                },
            },
        },
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Account Insights</h1>

            <div className="mb-4 flex space-x-4">
                <Select onValueChange={(value: 'balance' | 'stakedNFTs') => setSortBy(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="balance">Balance</SelectItem>
                        <SelectItem value="stakedNFTs">Staked NFTs</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Filter accounts"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                <Button onClick={() => setFilterValue('')}>Clear</Button>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Account Balance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <Pie data={chartData} options={chartOptions}/>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedAccounts.map((account) => (
                    <AccountCard key={account.id} account={account}/>
                ))}
            </div>
        </div>
    );
}

function AccountCard({account}: { account: Account }) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-sm font-medium text-gray-700">
                    {`${account.id.slice(0, 6)}...${account.id.slice(-4)}`}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <p className="text-2xl font-bold mb-2 text-indigo-600">
                    {`${parseFloat(formatEther(BigInt(account.balance))).toFixed(2)} $COMMONS`}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                    Staked NFTs: <span className="font-semibold">{account.stakedNFTs.length}</span>
                </p>
                {account.stakedNFTs.length > 0 && (
                    <div className="bg-gray-100 p-3 rounded-md">
                        <p className="text-xs font-medium text-gray-500 mb-1">Last Staked NFT</p>
                        <p className="text-sm">
                            <span className="font-semibold">Token ID:</span> {account.stakedNFTs[0].tokenId}
                        </p>
                        <p className="text-sm">
                            <span
                                className="font-semibold">Amount:</span> {formatEther(BigInt(account.stakedNFTs[0].amount))} $COMMONS
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Status:</span>
                            <span
                                className={`ml-1 px-2 py-1 rounded-full text-xs ${account.stakedNFTs[0].active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {account.stakedNFTs[0].active ? 'Active' : 'Inactive'}
              </span>
                        </p>
                        <p className="text-sm">
                            <span
                                className="font-semibold">Timestamp:</span> {new Date(parseInt(account.stakedNFTs[0].timestamp) * 1000).toLocaleString()}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


function LoadingSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-12 w-1/4 mb-8"/>
            <Skeleton className="h-[400px] w-full mb-8"/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-1/2"/>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-3/4 mb-2"/>
                            <Skeleton className="h-4 w-1/2"/>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}