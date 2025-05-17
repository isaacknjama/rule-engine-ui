import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  VStack,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { Rule, Member } from './types';

interface RuleEngineFormProps {
  onSubmit: (rule: Omit<Rule, 'id'>) => void;
  members: Member[];
  onCancel?: () => void;
  initialRule?: Partial<Rule>;
}

export const RuleEngineForm = ({
  onSubmit,
  members,
  onCancel,
  initialRule,
}: RuleEngineFormProps) => {
  const [name, setName] = useState(initialRule?.name || '');
  const [actionType, setActionType] = useState<Rule['actionType']>(
    initialRule?.actionType || 'notification'
  );
  const [triggerPeriod, setTriggerPeriod] = useState<Rule['triggerPeriod']>(
    initialRule?.triggerPeriod || 'daily'
  );
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    initialRule?.members || []
  );
  const [conditions, setConditions] = useState(initialRule?.conditions || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Rule name is required';
    }

    if (selectedMembers.length === 0) {
      newErrors.members = 'At least one member must be selected';
    }

    if (!conditions.trim()) {
      newErrors.conditions = 'Conditions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      name,
      actionType,
      triggerPeriod,
      members: selectedMembers,
      conditions,
    });
  };

  return (
    <Box width="100%">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Rule Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter rule name"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Action Type</FormLabel>
          <Select
            value={actionType}
            onChange={(e) =>
              setActionType(e.target.value as Rule['actionType'])
            }
          >
            <option value="notification">Notification</option>
            <option value="reminder">Reminder</option>
            <option value="payment">Payment</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Trigger Period</FormLabel>
          <Select
            value={triggerPeriod}
            onChange={(e) =>
              setTriggerPeriod(e.target.value as Rule['triggerPeriod'])
            }
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom Hours</option>
          </Select>
          {triggerPeriod === 'custom' && (
            <Input
              mt={2}
              placeholder="Enter hours (e.g. 24h)"
              onChange={(e) => setTriggerPeriod(e.target.value)}
            />
          )}
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.members}>
          <FormLabel>Select Members</FormLabel>
          <CheckboxGroup
            value={selectedMembers}
            onChange={(values) => setSelectedMembers(values as string[])}
          >
            <Stack direction="column">
              {members.map((member) => (
                <Checkbox key={member.id} value={member.id}>
                  {member.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
          <FormErrorMessage>{errors.members}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.conditions}>
          <FormLabel>Conditions</FormLabel>
          <Textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="Define conditions that trigger this rule"
            rows={4}
          />
          <FormErrorMessage>{errors.conditions}</FormErrorMessage>
        </FormControl>

        <Stack direction="row" spacing={4} justify="flex-end">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button colorScheme="teal" onClick={handleSubmit}>
            Save Rule
          </Button>
        </Stack>
      </VStack>
    </Box>
  );
};
