import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Divider,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Tag,
  IconButton,
  useDisclosure,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { Chama, ChamaTemplate, Rule, Member } from './types';
import { RuleEngineForm } from './RuleEngineForm';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface EditChamaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<ChamaTemplate, 'id'>) => void;
  initialTemplate?: Partial<ChamaTemplate>;
  currentChama?: Chama;
}

export const EditChamaModal = ({
  isOpen,
  onClose,
  onSave,
  initialTemplate,
  currentChama,
}: EditChamaModalProps) => {
  const [name, setName] = useState(initialTemplate?.name || '');
  const [description, setDescription] = useState(
    initialTemplate?.description || ''
  );
  const [rules, setRules] = useState<Omit<Rule, 'id'>[]>(
    initialTemplate?.rules?.map((r) => ({
      name: r.name,
      actionType: r.actionType,
      triggerPeriod: r.triggerPeriod,
      members: r.members,
      conditions: r.conditions,
    })) || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);

  const {
    isOpen: isRuleFormOpen,
    onOpen: onRuleFormOpen,
    onClose: onRuleFormClose,
  } = useDisclosure();

  // Mock members - in real implementation, you would get this from the API or props
  const members: Member[] = currentChama?.members || [
    { id: '1', name: 'John Doe', phone: '1234567890', role: 'member' },
    { id: '2', name: 'Jane Smith', phone: '0987654321', role: 'admin' },
    { id: '3', name: 'Bob Johnson', phone: '5555555555', role: 'member' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTemplate = () => {
    if (!validate()) return;

    onSave({
      name,
      description,
      rules: rules.map((rule, index) => ({ ...rule, id: index.toString() })),
    });

    onClose();
  };

  const handleAddRule = (rule: Omit<Rule, 'id'>) => {
    if (editingRuleIndex !== null) {
      // Edit existing rule
      const updatedRules = [...rules];
      updatedRules[editingRuleIndex] = rule;
      setRules(updatedRules);
      setEditingRuleIndex(null);
    } else {
      // Add new rule
      setRules([...rules, rule]);
    }
    onRuleFormClose();
  };

  const handleDeleteRule = (index: number) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  const handleEditRule = (index: number) => {
    setEditingRuleIndex(index);
    onRuleFormOpen();
  };

  const addNewRule = () => {
    setEditingRuleIndex(null);
    onRuleFormOpen();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {initialTemplate ? 'Edit Chama Template' : 'Create Chama Template'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Template Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter template name"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this template"
                  rows={3}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <Divider my={2} />

              <Box>
                <HStack justify="space-between" mb={2}>
                  <Heading size="md">Rules</Heading>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="teal"
                    size="sm"
                    onClick={addNewRule}
                  >
                    Add Rule
                  </Button>
                </HStack>

                {rules.length > 0 ? (
                  <Accordion allowMultiple>
                    {rules.map((rule, index) => (
                      <AccordionItem key={index}>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              {rule.name}
                            </Box>
                            <HStack spacing={2}>
                              <Tag colorScheme="blue">{rule.actionType}</Tag>
                              <Tag colorScheme="green">
                                {rule.triggerPeriod}
                              </Tag>
                              <AccordionIcon />
                            </HStack>
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <VStack align="stretch" spacing={2}>
                            <Box>
                              <strong>Members:</strong>{' '}
                              {rule.members
                                .map((id) => {
                                  const member = members.find(
                                    (m) => m.id === id
                                  );
                                  return member ? member.name : id;
                                })
                                .join(', ')}
                            </Box>
                            <Box>
                              <strong>Conditions:</strong> {rule.conditions}
                            </Box>
                            <HStack justify="flex-end" spacing={2}>
                              <IconButton
                                aria-label="Edit rule"
                                icon={<EditIcon />}
                                size="sm"
                                onClick={() => handleEditRule(index)}
                              />
                              <IconButton
                                aria-label="Delete rule"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleDeleteRule(index)}
                              />
                            </HStack>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <Box p={4} textAlign="center">
                    No rules added yet. Click "Add Rule" to create one.
                  </Box>
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSaveTemplate}>
              Save Template
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isRuleFormOpen} onClose={onRuleFormClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingRuleIndex !== null ? 'Edit Rule' : 'Add New Rule'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RuleEngineForm
              onSubmit={handleAddRule}
              members={members}
              onCancel={onRuleFormClose}
              initialRule={
                editingRuleIndex !== null ? rules[editingRuleIndex] : undefined
              }
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
