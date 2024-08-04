'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import { firestore } from "../firebase";
import { Autocomplete, Box, Button, Fab, Modal, TextField, Typography} from "@mui/material";
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";
import { async } from "@firebase/util";
import { Stack } from "@mui/system";
import AddIcon from '@mui/icons-material/AddCircleOutlined'
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline'
import EditIcon from '@mui/icons-material/Edit'

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

//dark mode or light mode
function MyApp() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
        p: 3,
      }}
    >
      {theme.palette.mode} mode
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
}

//function ToggleColorMode(){
  

  

// end


export default function Home() {

  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
      }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }
//remove item from the pantry
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

//edit item from the pantry 
// const editItem = 

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2} 
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          position="absolute" 
          top="50%" 
          left="50%" 
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName) 
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box>
      <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <MyApp />
      </ThemeProvider>
    </ColorModeContext.Provider>
      <Typography variant="h4">Welcome to Pantry Tracker</Typography>
    </Box>
      <Button
        variant="contained" 
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button> 
      <Stack spacing={2} sx={{ width: 200 }}>
      <Autocomplete
        freeSolo
        disableClearable
        renderInput={(itemName) => (
          <TextField
            {...itemName}
            label="Search Input"

          />
        )}
      />
      </Stack>
      <Box border="1px solid #333">
        <Box 
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color='#333'>
            Inventory Items
          </Typography>
        </Box>
      
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            inventory.map(({name, quantity}) => (
              <Box 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgColor="#5e8033"
                padding={5}
              >
                <Typography 
                  variant="h3" 
                  color="#333" 
                  textAlign="center"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography 
                  variant="h3" 
                  color="#333" 
                  textAlign="center"
                >
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                <Fab color="primary" aria-label="add" size= "small">
                  <EditIcon />
                </Fab>
                <Fab color="primary" aria-label="add" size= "small" onClick={() => addItem(name)}>
                  <AddIcon />
                </Fab>
                <Fab color="secondary" aria-label="remove" size="small" onClick={() => removeItem(name)}>
                <RemoveIcon />
                </Fab>
                </Stack>
              </Box>
            )) }
        </Stack>
      </Box>
    </Box> 
  )
}
