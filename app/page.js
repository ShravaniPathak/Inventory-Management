'use client'
import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      className="box"
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={3}
      sx={{ backgroundColor: '#eef2f3', overflow: 'hidden' }} // Prevent scrollbars
    >
      <Typography variant="h4" sx={{ mb: 3, color: '#333', animation: 'fadeIn 1s' }}>
        Welcome to Your Inventory Management System
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: '#666', animation: 'fadeIn 1s' }}>
        Easily add, remove, and manage your inventory items in one place.
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          p: 3,
        }}>
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 2 }}>
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={1}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              size="small"
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ mb: 3 }}
      >
        Add New Item
      </Button>
      <Box
        className="inventory-list"
        border={'1px solid #ccc'}
        borderRadius="8px"
        sx={{ width: '90%', maxWidth: 800, bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}
      >
        <Box
          width="100%"
          height="60px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius="8px 8px 0 0"
        >
          <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="100%"
          spacing={1}
          sx={{ p: 2, overflowY: 'auto', maxHeight: '300px' }} // Limit height for scrolling
        >
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              className="inventory-item"
              width="100%"
              minHeight="60px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f9f9f9'}
              paddingX={2}
              borderRadius="4px"
              sx={{ 
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                  backgroundColor: '#e0f7fa', // Light blue on hover
                  transform: 'scale(1.02)',
                }
              }}
            >
              <Typography variant={'body1'} color={'#333'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'body1'} color={'#333'}>
                Quantity: {quantity}
              </Typography>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
                size="small"
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Box>
  );
}
