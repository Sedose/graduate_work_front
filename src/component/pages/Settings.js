import React, { useEffect, useState } from 'react';
import { Container, Jumbotron, Table } from 'reactstrap';
import backendApi from '../../api/backend-api';

export default ({ getAccessToken }) => {
  const [settings, setSettings] = useState();

  useEffect(() => {
    setSettingsAsync();
  }, []);

  const setSettingsAsync = async () => {
    const settingsFromBackend = await fetchSettingsFromBackend();
    console.log('settingsFromBackend: ', settingsFromBackend);
    setSettings(settingsFromBackend);
  };

  async function fetchSettingsFromBackend() {
    const accessToken = await getAccessToken();
    return backendApi.fetchSettings(accessToken);
  }

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
                  <td><input onClick={(event) => setSettingValue(code, event.target.value)} /></td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );

  function setSettingValue(settingCode, value) {
    const selectedSetting = settings?.userSettings.find(({ code }) => code === settingCode);
    if (selectedSetting) {
      selectedSetting.value = value;
    }
  }
};
