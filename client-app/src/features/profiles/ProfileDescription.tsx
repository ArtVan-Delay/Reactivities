import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Tab, Grid, Header, Button, Segment, Label } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileEditForm from "./ProfileEditForm";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, profile, isCurrentUser } = rootStore.profileStore;
  const [editProfileMode, setEditProfileMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon='user' content={`About ${profile!.username}`} />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editProfileMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditProfileMode(!editProfileMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editProfileMode ? (
            <ProfileEditForm
            updateProfile={updateProfile}
            profile={profile!} />
          ) : (
            <Segment.Group>
              <Segment attached="top">
                <Grid>
                  <Grid.Column width={3}>
                    <Label>Display Name</Label>
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <p>{profile?.displayName}</p>
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment attached="top">
                <Grid>
                  <Grid.Column width={3}>
                    <Label>Bio</Label>
                  </Grid.Column>
                  <Grid.Column width={12}>
                    <p>{profile?.bio}</p>
                  </Grid.Column>
                </Grid>
              </Segment>
            </Segment.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
