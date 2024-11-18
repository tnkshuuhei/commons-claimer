"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TokenPage() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
        <Card className="w-[800px] max-w-[95vw]">
          <CardHeader className="text-center">
            <CardTitle>$COMMONS Token</CardTitle>
            <CardDescription>
            Why it is important and its Mission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 prose">
          <br/><p>The Commons Token is built on the Rochdale Principles of cooperation and mutual benefit. It aims to create a sustainable, regenerative economy for projects focused on public goods. Here is why it matters:</p>
    
            
            <ul><br/>
              <li><b>1. Sustainable Income for Builders</b><br/>
              <br/> <b>- Economic Participation:</b> The Commons Token ensures builders have a steady income to focus on long-term projects, providing consistent support for those creating public goods.
              <br/> <b>- Shared Success:</b> Builders commit a portion of their future projects back into the Commons ecosystem, pairing their own tokens with the Commons Token. This means the success of individual projects directly benefits the whole community, aligning incentives for mutual growth.</li>
              <br/><li><b>2. Collective Ownership and Control</b></li>
              <br/> <b>- Stake in the Ecosystem:</b> Holding the Commons Token gives participants exposure to a variety of impactful projects, ensuring that all benefit from the ecosystem success.
              <br/> <b>- Democratic Governance:</b> Token holders have a say in how resources are allocated, directing support to the most promising projects, reflecting the principle of democratic member control.<br/>
              <br/><li><b>3. Long-Term Focus on Regeneration</b></li>
              <br/> <b>- Education and Support:</b> The Commons Token equips builders with the resources and training needed for success, fostering a long-term focus on sustainability rather than short-term profits.
              <br/> <b>- Regenerative Growth:</b> It aligns with Regenerative Finance (ReFi), where the goal is to create systems that replenish and sustain, ensuring that both communities and projects thrive.<br/>
              <br/><li><b>4. Cooperative Network</b></li>
              <br/> <b>- Cooperation Among Projects:</b> Projects work together within the Commons ecosystem, sharing knowledge and resources to amplify their impact. The success of one project supports others, creating a resilient, collaborative network.
              
            </ul>

            <br/><h2> <b>Mission</b></h2>
            <p>
              The Commons Token aims to build a cooperative economy where public goods and community-driven projects can thrive. By providing sustainable income, fostering shared ownership, and aligning success with positive social impact, it ensures that projects focused on the common good have the support they need. It is a vision for a future where collaboration and mutual benefit drive a more inclusive and sustainable world.
            </p>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}