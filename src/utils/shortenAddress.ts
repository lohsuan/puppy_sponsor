export const shortenAddress = (address: string) =>
  `${address.slice(0, 8)}...${address.slice(address.length - 5)}`
