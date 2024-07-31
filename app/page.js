'user client'
import Image from "next/image";
import {userState, userEffect} from 'react';
import { Firestore } from "@/firebase";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Typography variant="h1">Inventory Management</Typography>
    </Box>  
  )
}
