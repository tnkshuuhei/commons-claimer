import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

import { Account } from "./page";

export default function WalletHolders({ accounts }: { accounts: Account[] }) {
   const walletsWithBalance = accounts.filter(account => parseFloat(account.balance) > 0);
  
    return (
      <div className="container mx-auto px-4 py-8">  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Wallet Holders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-indigo-600">{walletsWithBalance!.length}</p>
              <CardDescription style={{fontSize: "12px"}}>Number of unique wallets with a balance of greater than 0</CardDescription>
            </CardContent>
          </Card>
        </div>
  
      </div>
    );
  }
  
  // ... rest of the file remains unchanged ...
