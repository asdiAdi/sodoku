import type { NextPage } from 'next'
import Grid from '../components/grid'
import React from 'react'
// import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard' | 'evil'>('easy');
  const [toggleNewGame, setToggleNewGame] = React.useState<boolean>(false);
  const newGame = (diff: 'easy' | 'medium' | 'hard' | 'evil') => {
    setDifficulty(diff);
    setToggleNewGame(!toggleNewGame);
    setShowMenu(!showMenu);
  };
  return (
    <div className={styles.main}>
      <div className={styles['game-info']}>
        <div>
          <div className={`${styles['new-game']} ${styles.noselect}`} onClick={() => setShowMenu(!showMenu)}>New Game</div>
          { showMenu ?
            <div className={styles.menu}>
              <div className={styles['menu-grid']}>
                <div className={styles['menu-item']} onClick={() => newGame('easy')}>Easy</div>
                <div className={styles['menu-item']} onClick={() => newGame('medium')}>Medium</div>
                <div className={styles['menu-item']} onClick={() => newGame('hard')}>Hard</div>
                <div className={styles['menu-item']} onClick={() => newGame('evil')}>Expert</div>
                <div className={styles['menu-item']} onClick={() => newGame('evil')}>Evil</div>
                <div className={styles['menu-item']}>Restart</div>
              </div>
            </div>
          :null }
        </div>
        
        <div style={{display: 'flex'}}>Difficulty: <div style={{color: '#0096C7', marginLeft: '5px'}}> Medium</div></div>
        <div className={styles.clock}>
          59:99 <div>Icon</div>
        </div>
        
      </div>
      <Grid difficulty={difficulty} newGame={toggleNewGame}/>
    </div>
  )
}

export default Home