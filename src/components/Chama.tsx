import {
  Box,
  Button,
  Input,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export const Chama = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const toast = useToast();

  const createChama = async () => {
    if (!name.trim() || !description.trim()) {
      console.error('Name and description are required!');
      toast({
        title: 'Missing fields',
        description: 'Name and description are required!',
        status: 'error',
      });
      return;
    }

    try {
      const response = await fetch('api/create-chama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      toast({ title: 'Chama created successfully', status: 'success' });

      setName('');
      setDescription('');

      return data;
    } catch (error) {
      console.log(`Error creating chama: ${error}`);
      toast({ title: 'Chama creation failed!', status: 'error' });
    }
  };

  return (
    <Box justifyItems="center">
      <Stack justifyContent="center" gap={4} height="100vh" width="40%">
        <Input
          placeholder="Enter chama name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          placeholder="Tell us about your chama..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button colorScheme="teal" onClick={createChama}>
          Create Chama
        </Button>
      </Stack>
    </Box>
  );
};
