import { setError, clearError, selectError } from './redux/reducers/game';
import { useAppSelector, useAppDispatch } from './redux/hooks';

import './header.scss';

export default function ErrorModal() {
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();

  function onClose() {
    dispatch(clearError());
  }

  return (
    <>
    {error && <div className="midScreenModal">
        <h2>Error</h2>
        {error}
        <div onClick={onClose}>Close</div>
      </div>}
    </>
  );
}