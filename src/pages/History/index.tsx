import { useEffect, useState, useMemo, ReactNode } from 'react';
import { useGameContext } from '../../components/GameContext';
import { useNavigate } from 'react-router-dom';
import RestartButton from '../../components/Button';
import style from './style.module.css';

const History = () => {
  const { stats } = useGameContext();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [sessionHistory, setSessionHistory] = useState<Array<{
    numCols: ReactNode;
    numRows: ReactNode;
    date: string;
    moves: number;
    gameTime: number;
  }>>([]);
  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'moves' | 'gameTime';
    direction: 'ascending' | 'descending';
  }>({
    key: 'date',
    direction: 'ascending',
  });

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    setCurrentDate(formattedDate);

    const storedSessionHistory = localStorage.getItem('sessionHistory');
    if (storedSessionHistory) {
      setSessionHistory(JSON.parse(storedSessionHistory));
    }
  }, []);

  useEffect(() => {
    if (stats && currentDate) {
      if (stats.gameTime > 0 && stats.moves > 0) {
        const storedSessionHistory = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
        const newSession = { ...stats, date: currentDate };

        const isDuplicate = storedSessionHistory.some((session: { date: string; moves: number; gameTime: number; }) =>
          session.date === newSession.date && session.moves === newSession.moves && session.gameTime === newSession.gameTime
        );

        if (!isDuplicate) {
          const updatedSessionHistory = [...storedSessionHistory, newSession];
          localStorage.setItem('sessionHistory', JSON.stringify(updatedSessionHistory));
          setSessionHistory(updatedSessionHistory);
        }
      }
    }
  }, [stats, currentDate]);

  const handleSort = (key: 'date' | 'moves' | 'gameTime') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Использование useMemo для сортировки sessionHistory
  const sortedSessionHistory = useMemo(() => {
    return [...sessionHistory].sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date.split('-').reverse().join('-')).getTime();
        const dateB = new Date(b.date.split('-').reverse().join('-')).getTime();
        return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
        return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA;
      }
    });
  }, [sessionHistory, sortConfig]);

  const sessionByFieldSize: Record<'2x3' | '3x4' | '4x4' | '4x5' | '4x6', Array<{
    numCols: ReactNode;
    numRows: ReactNode;
    date: string;
    moves: number;
    gameTime: number;
  }>> = {
    '2x3': [],
    '3x4': [],
    '4x4': [],
    '4x5': [],
    '4x6': [],
  };
  
  // Группировка по размеру поля
  sortedSessionHistory.forEach(session => {
    const fieldSize = `${session.numRows}x${session.numCols}` as keyof typeof sessionByFieldSize;
  
    // Убедимся, что для поля есть массив
    if (!sessionByFieldSize[fieldSize]) {
      sessionByFieldSize[fieldSize] = [];
    }
  
    // Добавляем сессию в соответствующий массив
    sessionByFieldSize[fieldSize].push(session);
  });

  const getBestSessionForField = (fieldSize: keyof typeof sessionByFieldSize) => {
    const sessions = sessionByFieldSize[fieldSize];
    if (sessions.length === 0) return null;

    return sessions.reduce((bestSession, currentSession) => {
      if (!bestSession) return currentSession;
      if (currentSession.moves < bestSession.moves || 
          (currentSession.moves === bestSession.moves && currentSession.gameTime < bestSession.gameTime)) {
        return currentSession;
      }
      return bestSession;
    }, null as typeof sessions[0] | null);
  };

  const renderSortArrow = (key: 'date' | 'moves' | 'gameTime') => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  // Слайдер - состояние текущего слайда
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = Object.keys(sessionByFieldSize).length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="container">
      <RestartButton text="Вернуться в игру" onClick={() => navigate('/')} style={{ fontWeight: 'lighter', fontSize: '20px' }} />
      <h1>Статистика</h1>
      <div className={style.game_stats}>
        {/* Слайдер */}
        <div className={style.sliderContainer}>
        <RestartButton text="←" onClick={prevSlide} style={{position: 'absolute', top: '10px', left: '0px', transform: 'translateY(-50%)', zIndex: '1' }} />
          
          <div className={style.slide}>
            {Object.keys(sessionByFieldSize).map((fieldSize, index) => {
              if (index === currentSlide) {
                const fieldSessions = sessionByFieldSize[fieldSize as keyof typeof sessionByFieldSize];
                const bestSession = getBestSessionForField(fieldSize as keyof typeof sessionByFieldSize);

                return (
                  <div key={fieldSize}>
                    <h3>История игр для поля {fieldSize}</h3>
                    {bestSession && (
                      <div>
                        <h4>Лучший результат для поля {fieldSize}:</h4>
                        <p>Дата: {bestSession.date}</p>
                        <p>Минимальное количество ходов: {bestSession.moves}</p>
                        <p>Минимальное время игры: {bestSession.gameTime}</p>
                      </div>
                    )}
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('date')}>День и месяц {renderSortArrow('date')}</th>
                          <th onClick={() => handleSort('moves')}>Количество ходов {renderSortArrow('moves')}</th>
                          <th onClick={() => handleSort('gameTime')}>Время игры (секунд) {renderSortArrow('gameTime')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fieldSessions.map((session: { date: string; moves: number; gameTime: number }, index: any) => (
                          <tr key={`${session.date}-${index}`}>
                            <td>{session.date}</td>
                            <td>{session.moves}</td>
                            <td>{session.gameTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <RestartButton  text="→" onClick={nextSlide} style={{ position: 'absolute', top: '10px', right: '0px', transform: 'translateY(-50%)', zIndex: '1'}} />
        </div>

        <RestartButton
          text="Сбросить историю игр"
          onClick={() => {
            localStorage.removeItem('sessionHistory');
            setSessionHistory([]);
          }}
          style={{ border: 'none', backgroundColor: 'red', color: 'white', fontWeight: 'lighter', fontSize: '20px' }}
        />
      </div>
    </div>
  );
};

export default History;
