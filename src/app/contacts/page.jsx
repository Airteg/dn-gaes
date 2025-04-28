import React from "react";
import contacts from "../../../public/metadata/contacts.js";

export default function Contacts() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Контакти</h1>
      <div className="grid gap-4">
        {contacts.map((contact, index) => (
          <div key={index} className="document-card p-4 rounded-md shadow-md">
            <p className="font-bold text-lg mb-2 py-1">
              {contact.organization}
            </p>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 pl-8">
              <p className="lg:col-span-1 md:col-span-2 sm:col-span-1">
                <span className="font-bold">Адреса:</span> {contact.address}
              </p>
              <p className="lg:col-span-1 md:col-span-1 sm:col-span-1">
                <span className="font-bold">Телефон:</span> {contact.phone}
              </p>
              <p className="lg:col-span-1 md:col-span-1 sm:col-span-1 block">
                <span className="font-bold">Email: </span>
                <span className="text-blue-500 underline">{contact.email}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
