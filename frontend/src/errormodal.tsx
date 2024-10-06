import { setError, clearError, selectError } from './redux/reducers/game';
import { useAppSelector, useAppDispatch } from './redux/hooks';

import './modal.scss';

import Modal from './modal';

export default function ErrorModal() {
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  function onClose() {
    dispatch(clearError());
  }

  return (
    <>
    {error && <Modal onClose={onClose}>
        <h2>Error</h2>
        {error}
      </Modal>}
    </>
  );
}