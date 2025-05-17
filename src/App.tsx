import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Chama, ChamaList, ChamaTemplate } from './components';
import type { ChamaTemplate as ChamaTemplateType } from './components';

function App() {
  return (
    <Box p={4}>
      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Create Chama</Tab>
          <Tab>Chama List</Tab>
          <Tab>Templates</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Chama />
          </TabPanel>
          <TabPanel>
            <ChamaList />
          </TabPanel>
          <TabPanel>
            <ChamaTemplate />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default App;
