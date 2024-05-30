import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchRoom(action) {
    try {
        const response = yield axios.get(`/api/game/room/${action.payload}`);
        console.log(response);
        yield put({type: 'SET_ROOM', payload: response.data})
    } catch (error) {
        console.log('Room get request failed', error);
    }
};

function* roomSaga() {
    yield takeLatest('FETCH_ROOM', fetchRoom);
};

export default roomSaga;