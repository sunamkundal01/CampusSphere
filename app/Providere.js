'use client'


import { ConvexProvider, ConvexReactClient } from "convex/react";
import React from 'react'

// One client for the app's lifetime; creating it per render drops the websocket.
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const Providere = ({children}) => {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}

export default Providere
