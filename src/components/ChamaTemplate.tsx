import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  HStack,
  Badge,
  useDisclosure,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import type { ChamaTemplate as ChamaTemplateType } from './types';
import { EditChamaModal } from './EditChamaModal';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';

export const ChamaTemplate = () => {
  const [templates, setTemplates] = useState<ChamaTemplateType[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ChamaTemplateType | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // For demo purposes, initialize with some sample data
  useEffect(() => {
    // In a real application, you would fetch from an API endpoint
    const sampleTemplates: ChamaTemplateType[] = [
      {
        id: '1',
        name: 'Merry-go-round',
        description: 'Monthly contribution rotational payout template',
        rules: [
          {
            id: '101',
            name: 'Payment Reminder',
            actionType: 'notification',
            triggerPeriod: 'monthly',
            members: ['1', '2', '3'],
            conditions: 'If member has not paid by the 5th of the month',
          },
          {
            id: '102',
            name: 'Payout Alert',
            actionType: 'payment',
            triggerPeriod: 'monthly',
            members: ['1', '2', '3'],
            conditions:
              'When all members have paid their monthly contributions',
          },
        ],
      },
      {
        id: '2',
        name: 'Emergency Fund',
        description: 'Save for emergencies with periodic contributions',
        rules: [
          {
            id: '201',
            name: 'Contribution Reminder',
            actionType: 'reminder',
            triggerPeriod: 'weekly',
            members: ['1', '2'],
            conditions: 'Every Monday at 9am',
          },
        ],
      },
    ];

    setTemplates(sampleTemplates);
  }, []);

  const handleCreateTemplate = (newTemplate: Omit<ChamaTemplateType, 'id'>) => {
    const template: ChamaTemplateType = {
      ...newTemplate,
      id: Date.now().toString(),
    };

    setTemplates([...templates, template]);
    toast({
      title: 'Template created',
      description: `${template.name} has been created successfully`,
      status: 'success',
      duration: 3000,
    });
  };

  const handleUpdateTemplate = (
    updatedTemplate: Omit<ChamaTemplateType, 'id'>
  ) => {
    if (!selectedTemplate) return;

    const updatedTemplates = templates.map((template) =>
      template.id === selectedTemplate.id
        ? { ...updatedTemplate, id: selectedTemplate.id }
        : template
    );

    setTemplates(updatedTemplates);
    toast({
      title: 'Template updated',
      description: `${updatedTemplate.name} has been updated successfully`,
      status: 'success',
      duration: 3000,
    });
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter((template) => template.id !== id);
    setTemplates(updatedTemplates);
    toast({
      title: 'Template deleted',
      status: 'info',
      duration: 3000,
    });
  };

  const handleEditClick = (template: ChamaTemplateType) => {
    setSelectedTemplate(template);
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedTemplate(null);
    onOpen();
  };

  const handleModalClose = () => {
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Box p={5}>
      <HStack justify="space-between" mb={5}>
        <Heading size="lg">Chama Templates</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={handleAddNew}
        >
          Create Template
        </Button>
      </HStack>

      {templates.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {templates.map((template) => (
            <Card key={template.id} shadow="md" variant="outline">
              <CardHeader>
                <Heading size="md">{template.name}</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={3}>
                  <Text>{template.description}</Text>
                  <HStack>
                    <Text fontWeight="bold">Rules:</Text>
                    <Badge colorScheme="blue" borderRadius="full" px={2}>
                      {template.rules.length}
                    </Badge>
                  </HStack>
                </Stack>
              </CardBody>
              <CardFooter>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit template"
                    icon={<EditIcon />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => handleEditClick(template)}
                  />
                  <IconButton
                    aria-label="Delete template"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                  />
                </HStack>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Card p={5} textAlign="center">
          <Text>No templates found. Create one to get started!</Text>
        </Card>
      )}

      <EditChamaModal
        isOpen={isOpen}
        onClose={handleModalClose}
        onSave={selectedTemplate ? handleUpdateTemplate : handleCreateTemplate}
        initialTemplate={selectedTemplate || undefined}
      />
    </Box>
  );
};
