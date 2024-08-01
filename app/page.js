'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import { firestore, Firestore } from "@/firebase";
import { Box, Typography } from "@mui/material";
import { collection, getDoc, query } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDoc(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  //const removeItem

  useEffect(() => {
    updateInventory()
  }, [])

  return (
    <Box>
      <Typography variant="h1">Inventory Management</Typography>
      {
        inventory.forEach((item) => {
          console.log(item)
          return(
            <Box>
            {item.name}
            {item.count}
            </Box>
          )
        }
      )}
    </Box>  
  )
}
