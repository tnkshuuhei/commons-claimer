"use client";
import React from "react";

import Tipping from "@/components/Tipping";

import { data, UserData } from "@/data";

export default function TipPage() {
  const recipients: UserData[] = data;
  return (
    <div className="grid grid-cols-2 gap-4 lg:p-12 p-4 items-center mx-auto">
      {recipients.map((recipient, index) => (
        <Tipping key={index} {...recipient} />
      ))}
    </div>
  );
}
