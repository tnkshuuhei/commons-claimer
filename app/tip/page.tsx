"use client";
import React from "react";

import Tipping from "@/components/Tipping";

import { data, UserData } from "@/data";

export default function TipPage() {
  const recipients: UserData[] = data;
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4">
        {recipients.map((recipient, index) => (
          <Tipping key={index} {...recipient} />
        ))}
      </div>
    </div>
  );
}
