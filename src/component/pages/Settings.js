import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
    setSettings(await fetchSettingsFromBackend());
  };

  async function fetchSettingsFromBackend() {
    return backendApi.fetchSettings(await getAccessToken());
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
                  <td>
                    <input
                      type="number"
                      min={-2147483648}
                      max={2147483647}
                      onChange={(event) => setSettingValue(code, event.target.value)}
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
        <Button onClick={() => handleSaveAllSettings(settings)(getAccessToken)}>
          Save all changes
        </Button>
      </Container>
    </>
  );

  function setSettingValue(settingCode, settingValueNew) {
    const parsedSettingValue = parseInt(settingValueNew, 10);
    if (!isInteger(parsedSettingValue)) {
      toast.error('Error on perform operation. Invalid form input. Enter integer!');
    }
    const newSettings = settings?.userSettings.map((setting) => (
      setting.code === settingCode ? { ...setting, value: settingValueNew } : setting
    ));
    setSettings(newSettings);
  }
};

const isInteger = (maybeInteger) => (
  Number.isInteger(maybeInteger)
    && maybeInteger > -2147483648 && maybeInteger < 2147483647
);

const handleSaveAllSettings = (settings) => async (getAccessToken) => {
  const userSettingsRequestBody = {
    userSettings: settings.userSettings.map(({ code, value }) => ({
      code,
      newValue: value,
    })),
  };
  await backendApi.saveAllUserSettings(userSettingsRequestBody)(await getAccessToken());
};
