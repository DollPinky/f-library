import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

function WelcomeCard() {
  return (
    <Card className="relative col-span-full overflow-hidden rounded-xl bg-primary text-white md:col-span-2 shadow-md">
      <CardContent className="flex h-full items-center justify-between p-6">
        <div className="z-10 flex flex-col gap-4">
          <h2 className="text-3xl font-bold">Welcome back Anthony</h2>
          <p className="max-w-xs text-sm opacity-90">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </p>
          <Button className="w-fit bg-white text-primary-pink hover:bg-gray-100">
            ADD NEW BOOK
          </Button>
        </div>
        <img
          src=""
          alt="Book Stack"
          className="absolute -right-10 -bottom-10 h-64 w-auto object-contain md:relative md:h-full md:w-auto md:right-0 md:bottom-0"
        />
      </CardContent>
    </Card>
  );
}

export default WelcomeCard;
