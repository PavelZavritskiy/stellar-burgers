import { FC } from 'react';
import './not-found-page.css';

export const NotFound404: FC = () => (
  <div className='notFoundPage'>
    <h3 className={`pb-6 text text_type_main-large`}>
      Страница не найдена. Ошибка 404.
    </h3>
  </div>
);
