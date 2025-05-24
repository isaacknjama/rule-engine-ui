import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface Member {
  id: string;
  name: string;
  phone: string;
  role: string;
}

interface Chama {
  id: string;
  name: string;
  members: Member[];
  walletId: string;
  description: string;
}

export const ChamaList = () => {
  const [chamas, setChamas] = useState<Chama[]>([]);

  useEffect(() => {
    const fetchChamas = async () => {
      try {
        const response = await fetch('/api/chamas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setChamas(data.chamas);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChamas();
  }, []);

  return (
    <>
      {chamas.length > 0 ? (
        <SimpleGrid columns={3} gap={4}>
          {chamas.map((chama) => (
            <Card key={chama.id} shadow="md" variant="outline" size="md">
              <CardHeader>
                <Heading>{chama.name}</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={3}>
                  <Text>{chama.description}</Text>
                  <HStack spacing={2} wrap="wrap">
                    {chama.members &&
                      chama.members.map((member) => (
                        <Tag
                          key={member.id}
                          borderRadius="full"
                          size="md"
                          variant="solid"
                          colorScheme="green"
                        >
                          {member.name}
                        </Tag>
                      ))}
                  </HStack>

                  <Button colorScheme="teal">Edit Chama</Button>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Card>
          <Text>No chamas found!</Text>
        </Card>
      )}
    </>
  );
};
