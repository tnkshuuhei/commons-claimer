export interface UserData {
  name: string;
  address: string;
  imageUrl?: string;
}

export const data: UserData[] = [
  {
    name: "Alice",
    address: "0x1234567890",
  },
  {
    name: "Bob",
    address: "0x0987654321",
  },
  {
    name: "Charlie",
    address: "0x1357924680",
  },
];
