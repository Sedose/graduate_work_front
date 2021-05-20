import React, { useEffect, useState } from 'react';
import {
  Button, Container, Jumbotron, Table, 
} from 'reactstrap';
import backendApi from '../../api/backend-api';

export default ({ getAccessToken }) => {
  const [settings, setSettings] = useState();

  useEffect(() => {
    setSettingsAsync();
  }, []);

  const setSettingsAsync = async () => {
    const settingsFromBackend = await fetchSettingsFromBackend();
    setSettings(settingsFromBackend);
  };

  async function fetchSettingsFromBackend() {
    const accessToken = await getAccessToken();
    return backendApi.fetchSettings(accessToken);
  }

  const handleSaveAllSettings = async () => {
    const userSettingsRequestBody = {
      userSettings: settings.userSettings.map(({ code, value }) => ({
        code,
        newValue: value,
      })), 
    };
    const accessToken = await getAccessToken();
    console.log('accessToken: ', accessToken);
    await backendApi.saveAllUserSettings(userSettingsRequestBody)(accessToken);
  };

  return (
    <>
      <Jumbotron>
        <h1>Managing user settings</h1>
      </Jumbotron>
      <Container>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Description</th>
              <th>Value</th>
              <th>Default value</th>
              <th>New value</th>
            </tr>
          </thead>
          <tbody>
            { settings && settings.userSettings.map(
              ({
                code, value, description, defaultValue, 
              }, index) => (
                <tr key={code}>
                  <th scope="row">{index + 1}</th>
                  <td>{code}</td>
                  <td>{description}</td>
                  <td>{value}</td>
                  <td>{defaultValue}</td>
                  <td><input onChange={(event) => setSettingValue(code, event.target.value)} /></td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
        <Button onClick={() => handleSaveAllSettings()}>
          Save all changes
        </Button>
      </Container>
    </>
  );

  function setSettingValue(settingCode, value) {
    const selectedSetting = settings?.userSettings.find(({ code }) => code === settingCode);
    console.log('selectedSetting: ', selectedSetting);
    if (selectedSetting) {
      selectedSetting.value = value;
    }
  }
};
