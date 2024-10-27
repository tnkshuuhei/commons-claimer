"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ManifestoPage() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4">
        <Card className="w-[800px] max-w-[95vw]">
          <CardHeader className="text-center">
            <CardTitle>Commons Protocol Manifesto</CardTitle>
            <CardDescription>
              Our alignment for a regenerative future
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 prose">
          <br/><p>In an age where profit-driven systems often deplete our shared resources, we propose a cooperative digital economy governed by a community-driven token ($COMMONS) and time-tested principles of democratic collaboration, based on the <b>Rochdale principles.</b></p>
            <br/>
            <h2><b>Our Core Principles</b></h2>
            <ul>
              <li><b>0. Directionally Decentralized:</b> The following points are our goals and our DAO commits to a best effort to follow up on that commitment.</li>
              <br/><li><b>1. Voluntary and Open Participation:</b> The system is open to all who wish to contribute to and benefit from shared resources, without discrimination. While tokens can be traded, meaningful participation comes through active and diversified contributions to the commons.</li>
              <br/><li><b>2. Democratic Control:</b> {"Each token holder has an equal voice in governance (one member, one vote), regardless of the number of tokens held. This ensures decisions about shared resources reflect the community's needs, not wealth concentration."}</li>
              <br/><li><b>3. Member Economic Participation:</b> Token holders contribute equitably to, and democratically control, the commons. While tokens can be claimed, as income by builders, and traded, their fundamental value comes from:
              <br/> - Verified contributions to shared resources
              <br/> - Limited returns on speculation
              <br/> - Surplus value directed toward:
              <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Development of the commons
              <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Rewards for active contributors
              <br/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Community-approved initiatives
              </li>
              <br/><li><b>4. Autonomy and Independence:</b> While the Commons Token operates within existing markets, its governance remains independent and community-controlled. External partnerships must preserve this autonomy.</li>
              <br/><li><b>5. Education and Training:</b> A portion of resources is dedicated to:
              <br/> - Training contributors in commons management
              <br/> - Educating the public about regenerative economics
              <br/> - Sharing knowledge and best practices</li>
              <br/><li><b>6. Cooperation Among Commons:</b> The system actively collaborates with other commons-based initiatives, strengthening the broader regenerative economy movement.</li>
              <br/><li><b>7. Concern for Community:</b> All activities must contribute to the sustainable development of both digital and physical commons, as approved by token holders.</li>
            </ul>

            <h2> </h2>
            <p>
              
            </p>

          </CardContent>
        </Card>
        
      </div>
    </main>
  );
}