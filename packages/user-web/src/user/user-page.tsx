import { uniqueId } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { APIClient } from "./api-client";
import { useUsers } from "./user-context";
import { PartialUser, UserForm } from "./user-form-component";
import { User, UserType } from "./user.mjs";

const createUser = async (user: User): Promise<User> => {
  return APIClient.request<User>({
    url: '/users',
    method: 'POST',
    body: user,
  });
};

const patchUser = async (id: string, user: Partial<User>): Promise<User> => {
  return APIClient.request<User>({
    url: `/users/${id}`,
    method: 'PATCH',
    body: user,
  });
};

type UserRouteParams = { id: string };

export function UserPage() {
  const {
    updateUser,
    users,
    addUser
  } = useUsers();
  const [userDetails, setUserDetails] = useState<User>();

  // document mentioned a 404 as a posibility if the user does not exist, so we need to take care of this case as well
  const [error, setError] = useState<string | null>(null);
  const params = useParams<UserRouteParams>();
  const navigate = useNavigate();
  // since we only need to take care of editing if the id is unto the params
  // we only need to check this selector
  const isEditing = Boolean(params.id);
  const id = params.id;

  useEffect(() => {
    if (isEditing && id) {
      APIClient.request<User>({
        url: `/users/${id}`,
        method: 'GET',
      }).then(setUserDetails)
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Unknown error');
          // if api is no available then use context
          const user = users.find((usr) => usr.id === id);
          if (user) {
            console.log(user, "user")
            setUserDetails(user);
          }
        });
    }
  }, [id, isEditing]);

  const onCancelForm = () => {
    // since we only navigate back we dont need to take care of unmounting the form component
    navigate("/");
  };

  const onSaveForm = (user: User | PartialUser) => {
    try {
      // if we are editing we need to patch the user
      if (isEditing) {
        patchUser(`/users/${id}`, user)
          .catch(() => {
            // if the api is not available
            if (id) updateUser(id, user);
          })
          .finally(() => {
            navigate("/");
          });
        return;
      }

      // since we depends into the id, and if the api is not available it wont be set without assitance
      const newUser: User = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || undefined,
        type: user.type || UserType.Basic,
        id: user.id || uniqueId('temp')
      }
      createUser(newUser)
        .catch(() => {
          // if api is not available
          addUser(newUser)
        })
        .finally(() => {
          navigate("/");
        });
      return;
    } catch (err) {
      if (err instanceof Error) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
  };
  return (
    <div className="modify-user-page">
      <h2>User Page</h2>
      <div className="UserFormContainer">
        <UserForm initialValues={userDetails} onCancel={onCancelForm} onSave={onSaveForm} />
      </div>
      <span>{error}</span>
    </div>
  );
}
