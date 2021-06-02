import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button, Container, Jumbotron, Table, 
} from 'reactstrap';
import backendApi from '../../api/backend-api';
import { isInteger } from '../../util';

export default ({ getAccessToken }) => {
  const [settingsFromBackend, setSettings] = useState();
  const [settingsToUpdate, setSettingsToUpdate] = useState();

  useEffect(() => {
    setSettingsAsync();
  }, []);
  
  const setSettingValue = (settingCode, settingValueNew) => {
    const parsedSettingValue = parseInt(settingValueNew, 10);
    if (!isInteger(parsedSettingValue)) {
      toast.error('Error on perform operation. Invalid form input. Enter non-zero integer!');
    }
    const newSettings = settingsFromBackend?.userSettings.map((setting) => (
      setting.code === settingCode ? { ...setting, value: settingValueNew } : setting
    ));
    setSettingsToUpdate(newSettings);
  };

  const handleSaveAllSettings = async () => {
    await backendApi.saveAllUserSettings(
      formUserSettingsRequestBody(settingsToUpdate),
    )(await getAccessToken());
    toast.info('Trying to save all user settings');
    await setSettingsAsync();
    toast.success('Successfully performed operation!');
  };

  const setSettingsAsync = async () => {
    setSettings(await backendApi.fetchSettings(await getAccessToken()));
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
            { settingsFromBackend && settingsFromBackend.userSettings.map(
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
        <Button onClick={() => handleSaveAllSettings(getAccessToken)}>
          Save all changes
        </Button>
      </Container>
    </>
  );
};

const formUserSettingsRequestBody = (settings) => ({
  userSettings: settings.map(({ code, value }) => ({
    code,
    newValue: value,
  })),
});
