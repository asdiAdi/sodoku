import type { NextPage } from 'next'
import Grid from '../components/grid'
import React from 'react'
import styles from '../styles/Home.module.css'

//To Do: Code refactoring after learning more react
const Home: NextPage = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard' | 'expert' | 'evil'>('easy');
  const [toggleNewGame, setToggleNewGame] = React.useState<boolean>(false);
  const [input, setInput] = React.useState<number>(0);
  const [toggleInput, setToggleInput] = React.useState<boolean>(false);
  const [toggleUndo, setToggleUndo] = React.useState<boolean>(false);
  const [toggleErase, setToggleErase] = React.useState<boolean>(false);
  const [toggleNotes, setToggleNotes] = React.useState<boolean>(false);
  const [toggleHint, setToggleHint] = React.useState<boolean>(false);
  const [toggleRestart, setToggleRestart] = React.useState<boolean>(false);
  const [time, setTime] = React.useState<string>('00:00');
  const [pause, setPause] = React.useState<boolean>(false);
  const [timerId, setTimerId] = React.useState<NodeJS.Timeout>();
  const newGame = (diff: 'easy' | 'medium' | 'hard' | 'expert' | 'evil') => {
    setDifficulty(diff);
    setToggleNewGame(!toggleNewGame);
    setShowMenu(!showMenu);
    setTime('00:00');
    handlePlay();
  };
  const handleRestart = () => {
    setToggleRestart(!toggleRestart);
    setToggleNotes(false);
    setShowMenu(!showMenu);
    setTime('00:00');
    handlePlay();
  }
  const handleInput = (num: number) => {
    setInput(num);
    setToggleInput(!toggleInput);
  }
  // To Do: A better way of handling pause and clock in general
  const handlePause = () => {
    clearTimeout(timerId);
    setPause(true);
  }
  const handlePlay = () => {
    clearTimeout(timerId);
    setTimerId(setTimeout(() => {
      let timeInt = time.split(':').map(val => parseInt(val));
      let totalSecond = timeInt[0] * 60 + timeInt[1] + 1;
      let minute = Math.floor(totalSecond / 60);
      let second = totalSecond - minute * 60
      let timeStr = `${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`;
      setTime(timeStr);
    }, 1000))
    setPause(false);
  }
  React.useEffect(() => {
      setTimerId(setTimeout(() => {
        let timeInt = time.split(':').map(val => parseInt(val));
        let totalSecond = timeInt[0] * 60 + timeInt[1] + 1;
        let minute = Math.floor(totalSecond / 60);
        let second = totalSecond - minute * 60
        let timeStr = `${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`;
        setTime(timeStr);
      }, 1000))
  }, [time])
  return (
    <div className={styles.main}>
      {/* Top Bar */}
      <div className={styles['game-info']}>
        <div>
          <div className={`${styles['new-game']} ${styles.noselect}`} onClick={() => setShowMenu(!showMenu)}>New Game</div>
          {showMenu ?
            <div className={styles.menu}>
              <div className={styles['menu-grid']}>
                <div className={styles['menu-item']} onClick={() => newGame('easy')}>Easy</div>
                <div className={styles['menu-item']} onClick={() => newGame('medium')}>Medium</div>
                <div className={styles['menu-item']} onClick={() => newGame('hard')}>Hard</div>
                <div className={styles['menu-item']} onClick={() => newGame('expert')}>Expert</div>
                <div className={styles['menu-item']} onClick={() => newGame('evil')}>Evil</div>
                <div className={styles['menu-item']} onClick={() => handleRestart()}>Restart</div>
              </div>
            </div>
            : null}
        </div>
        <div style={{ display: 'flex' }}>Difficulty: <div className={styles.difficulty}>{difficulty}</div></div>
        <div className={styles['clock-container']}>
          {time}
          {!pause ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.noselect} onClick={() => handlePause()}>
            <path d="M11 7H8V17H11V7Z" fill="currentColor" /><path d="M13 17H16V7H13V17Z" fill="currentColor" />
          </svg> :
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.noselect} onClick={() => handlePlay()}>
              <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
            </svg>}
        </div>
      </div>
      {/* 9x9 Sudoku Board */}
      <div className={styles['sudoku-container']}>
        {pause ?
          <div className={`${styles['pause-screen']}`} onClick={() => handlePlay()}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles['play-icon']}>
              <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
            </svg>
          </div> : null}
        <Grid difficulty={difficulty}
          className={styles['grid-container']}
          newGameToggle={toggleNewGame}
          input={input} toggleInput={toggleInput}
          toggleUndo={toggleUndo}
          toggleErase={toggleErase}
          toggleNotes={toggleNotes}
          toggleHint={toggleHint}
          toggleRestart={toggleRestart} />
      </div>


      {/* Icons */}
      <div className={styles['icons-container']} style={pause? {pointerEvents: 'none'}: {}}>
        <div className={`${styles.icon} ${styles.noselect}`}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setToggleUndo(!toggleUndo)}><path d="M5.33929 4.46777H7.33929V7.02487C8.52931 6.08978 10.0299 5.53207 11.6607 5.53207C15.5267 5.53207 18.6607 8.66608 18.6607 12.5321C18.6607 16.3981 15.5267 19.5321 11.6607 19.5321C9.51025 19.5321 7.58625 18.5623 6.30219 17.0363L7.92151 15.8515C8.83741 16.8825 10.1732 17.5321 11.6607 17.5321C14.4222 17.5321 16.6607 15.2935 16.6607 12.5321C16.6607 9.77065 14.4222 7.53207 11.6607 7.53207C10.5739 7.53207 9.56805 7.87884 8.74779 8.46777L11.3393 8.46777V10.4678H5.33929V4.46777Z" fill="currentColor" /></svg></div>
        <div className={`${styles.icon} ${styles.noselect}`}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setToggleErase(!toggleErase)}><path fillRule="evenodd" clipRule="evenodd" d="M3.49997 12.8995C2.71892 13.6805 2.71892 14.9468 3.49997 15.7279L7.35785 19.5858H4.08576C3.53347 19.5858 3.08576 20.0335 3.08576 20.5858C3.08576 21.1381 3.53347 21.5858 4.08576 21.5858H20.0858C20.638 21.5858 21.0858 21.1381 21.0858 20.5858C21.0858 20.0335 20.638 19.5858 20.0858 19.5858H10.9558L20.4705 10.071C21.2516 9.28999 21.2516 8.02366 20.4705 7.24261L16.2279 2.99997C15.4468 2.21892 14.1805 2.21892 13.3995 2.99997L3.49997 12.8995ZM7.82579 11.4021L4.91418 14.3137L9.15683 18.5563L12.0684 15.6447L7.82579 11.4021ZM9.24 9.98787L13.4826 14.2305L19.0563 8.65683L14.8137 4.41418L9.24 9.98787Z" fill="currentColor" /></svg></div>
        <div className={`${styles.icon} ${styles.noselect}`} style={ toggleNotes ? { border: '2px solid #0096C7' } : {}}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setToggleNotes(!toggleNotes)}><path fillRule="evenodd" clipRule="evenodd" d="M21.2635 2.29289C20.873 1.90237 20.2398 1.90237 19.8493 2.29289L18.9769 3.16525C17.8618 2.63254 16.4857 2.82801 15.5621 3.75165L4.95549 14.3582L10.6123 20.0151L21.2189 9.4085C22.1426 8.48486 22.338 7.1088 21.8053 5.99367L22.6777 5.12132C23.0682 4.7308 23.0682 4.09763 22.6777 3.70711L21.2635 2.29289ZM16.9955 10.8035L10.6123 17.1867L7.78392 14.3582L14.1671 7.9751L16.9955 10.8035ZM18.8138 8.98525L19.8047 7.99429C20.1953 7.60376 20.1953 6.9706 19.8047 6.58007L18.3905 5.16586C18 4.77534 17.3668 4.77534 16.9763 5.16586L15.9853 6.15683L18.8138 8.98525Z" fill="currentColor" /><path d="M2 22.9502L4.12171 15.1717L9.77817 20.8289L2 22.9502Z" fill="currentColor" /></svg></div>
        <div className={`${styles.icon} ${styles.noselect}`}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setToggleHint(!toggleHint)}><path fillRule="evenodd" clipRule="evenodd" d="M4 9C4 11.9611 5.60879 14.5465 8 15.9297V15.9999C8 18.2091 9.79086 19.9999 12 19.9999C14.2091 19.9999 16 18.2091 16 15.9999V15.9297C18.3912 14.5465 20 11.9611 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9ZM16 13.4722C17.2275 12.3736 18 10.777 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 10.777 6.7725 12.3736 8 13.4722L10 13.4713V16C10 17.1045 10.8954 17.9999 12 17.9999C13.1045 17.9999 14 17.1045 14 15.9999V13.4713L16 13.4722Z" fill="currentColor" /><path d="M10 21.0064V21C10.5883 21.3403 11.2714 21.5351 12 21.5351C12.7286 21.5351 13.4117 21.3403 14 21V21.0064C14 22.111 13.1046 23.0064 12 23.0064C10.8954 23.0064 10 22.111 10 21.0064Z" fill="currentColor" /></svg></div>
      </div>
      {/* Keypad */}
      <div className={styles['keypad-container']} style={pause? {pointerEvents: 'none'}: {}}>
        <div className={styles['keypad-number']} onClick={() => handleInput(1)}>1</div>
        <div className={styles['keypad-number']} onClick={() => handleInput(2)}>2</div>
        <div className={styles['keypad-number']} onClick={() => handleInput(3)}>3</div>
        <div className={styles['keypad-number']} onClick={() => handleInput(4)}>4</div>
        <div className={styles['keypad-number']} onClick={() => handleInput(5)}>5</div>
        <div className={styles['keypad-number']} onClick={() => handleInput(6)}>6</div>
        <div className={styles['keypad-number']} onClick={() => handleInput(7)}>7</div>
        <div className={styles['keypad-number']} onClick={() => handleInput(8)}>8</div>
        <div className={styles['keypad-number']} onClick={() => handleInput(9)}>9</div>
      </div>
    </div>
  )
}

export default Home