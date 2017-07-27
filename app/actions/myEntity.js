// redux
import {
  APP_SET_FAILURE_MESSAGE,
  APP_SET_LOADING_STATUS,
  APP_SET_SUCCESS_MESSAGE,
  APP_HIDE_DIALOG,
  APP_UPDATE_CURRENT_OBJECT,
  FORM_SET_VALUES,
  MY_ENTITY_GET_SUCCESS,
  MY_ENTITY_DELETE_SUCCESS,
  routes,
} from 'constants/index';
import {
  setLoadingStatus as setLoadingStatusAction,
  setFailureMessage as setFailureMessageAction,
  setSuccessMessage as setSuccessMessageAction,
  updateCurrentObject as updateCurrentObjectAction,
} from 'actions/app';
import {
  formValidateAll as formValidateAllAction,
} from 'actions/form';
import {
  goTo as goToAction,
} from 'actions/router';

// utils
import {
  MyEntityAPI,
} from 'utils/api';

export function getMyEntitiesRequest() {
  return {
    types: {
      request: [APP_SET_LOADING_STATUS],
      success: [APP_SET_SUCCESS_MESSAGE, MY_ENTITY_GET_SUCCESS],
      failure: [APP_SET_FAILURE_MESSAGE],
    },
    callAPI: MyEntityAPI.list,
  };
}

export function getMyEntitiesSuccess(myEntities) {
  return {
    type: MY_ENTITY_GET_SUCCESS,
    payload: myEntities,
  };
}

// export function getMyEntitiesFailure() {
//   return {
//     type: MY_ENTITY_GET_REQUEST,
//   };
// }

export function createMyEntityRequest(myEntity, formConfig) {
  return (dispatch, getState) => {

    dispatch(formValidateAllAction(myEntity, formConfig));

    if (getState().form.errors.number === 0) {

      dispatch(setLoadingStatusAction());

      MyEntityAPI.create(myEntity)
        .then(() => {
          dispatch(setSuccessMessageAction('The MyEntity has been created successfully.'));
          setTimeout(() => {
            dispatch(goToAction(routes.MY_ENTITY_LIST));
          }, 1000);
        }).catch((error) => {
          dispatch(setFailureMessageAction(error));
        });

    }

  };
}

// export function createMyEntitySuccess() {
//   return {
//     type: MY_ENTITY_CREATE_SUCCESS,
//   };
// }

// export function createMyEntityFailure() {
//   return {
//     type: MY_ENTITY_CREATE_FAILURE,
//   };
// }

export function getMyEntityByIdRequest(id, formConfig) {
  return {
    types: {
      request: [APP_SET_LOADING_STATUS],
      success: ((actionsArray) => {
        if (formConfig) {
          actionsArray.push(FORM_SET_VALUES);
        }
        return actionsArray;
      })([APP_SET_SUCCESS_MESSAGE, APP_UPDATE_CURRENT_OBJECT]),
      failure: [APP_SET_FAILURE_MESSAGE],
    },
    callAPI: MyEntityAPI.getById(id),
    payload: {
      formConfig,
    },
  };
}

// export function getMyEntityByIdSuccess() {
//   return {
//     type: MY_ENTITY_GET_BY_ID_SUCCESS,
//   };
// }

// export function getMyEntityByIdFailure() {
//   return {
//     type: MY_ENTITY_GET_BY_ID_FAILURE,
//   };
// }

export function editMyEntityRequest(myEntity, config = {}) {
  return (dispatch, getState) => {

    if (config.formConfig) {
      dispatch(formValidateAllAction(myEntity, config.formConfig));
    }

    if (getState().form.errors.number === 0 || !config.formConfig) {

      dispatch(setLoadingStatusAction());

      MyEntityAPI.edit(myEntity)
        .then(() => {

          dispatch(setSuccessMessageAction('The MyEntity has been updated successfully.', config.outputMessageUIType));

          if (config.updateCurrentObject) {
            dispatch(updateCurrentObjectAction(myEntity));
          }

          if (config.redirect) {
            setTimeout(() => {
              dispatch(goToAction(routes.MY_ENTITY_LIST));
            }, 1000);
          }

        }).catch((error) => {
          dispatch(setFailureMessageAction(error, config.outputMessageUIType));
        });

    }

  };
}

// export function editMyEntitySuccess() {
//   return {
//     type: MY_ENTITY_EDIT_SUCCESS,
//   };
// }

// export function editMyEntityFailure() {
//   return {
//     type: MY_ENTITY_EDIT_FAILURE,
//   };
// }

export function deleteMyEntityRequest(id) {
  return {
    types: {
      request: [APP_SET_LOADING_STATUS, APP_HIDE_DIALOG],
      success: [APP_SET_SUCCESS_MESSAGE, MY_ENTITY_DELETE_SUCCESS],
      failure: [APP_SET_FAILURE_MESSAGE],
    },
    callAPI: MyEntityAPI.delete(id),
    payload: {
      uiType: 'TOAST',
      successMessage: 'The MyEntity has been deleted successfully.',
      myEntityId: id,
    },
  };
}

export function deleteMyEntitySuccess(payload) {
  return {
    type: MY_ENTITY_DELETE_SUCCESS,
    payload,
  };
}

// export function deleteMyEntityFailure() {
//   return {
//     type: MY_ENTITY_DELETE_FAILURE,
//   };
// }
