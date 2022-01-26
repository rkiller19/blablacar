import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import equal from 'fast-deep-equal'

import DAO1Logo from '../../assets/white-logo.png'
import ArrowIcon from '../../assets/arrow-down.png'
import {
  card,
  cardWrapper,
  cardHead,
  cardHeadLogo,
  cardLabel,
  cardInfoText,
  cardName,
  cardNameText,
  cardStakingConditions,
  cardStakingConditionsItem,
  cardStakingList,
  cardStakingListEmpty,
  cardStakingItem,
  cardStakingItemHead,
  cardStakingItemInfo,
  cardStakingItemInfoBlock,
  cardStakingItemButtons,
  cardStakingItemDetails,
  cardStakingItemDetailsHide,
  cardStakingItemDetailsRow,
  cardStakingItemDetailsName,
  cardStakingItemDetailsValue,
  cardArrowButton,
  cardArrowButtonActive,
  cardFooter,
  cardTatalStaked,
  cardTatalStakedValue,
  cardButton,
  stakeModal,
  stakeModalTitle,
  stakeModalInputContainer,
  stakeModalInput,
  stakeModalMaxButton,
  errorMessage,
  stakeModalBalance,
  hoverLoader,
} from './stakingCard.module.scss'
import { Button, Modal, Title, Input, Spinner, TxLoader } from '../'
import { withFixedStakingApi } from '../../services/staking/FixedStaking'

function StakingCardPure({ api, APY }) {
  const { getData, stake, unstake, harvest, approve } = api
  const [stakeDurationDays, setStakeDurationDays] = useState(0)
  const [yieldRate, setYieldRate] = useState(0)
  const [stakingHistory, setStakingHistory] = useState([])
  const [totalStaked, setTotalStaked] = useState(0)
  const [tokensBalance, setTokensBalance] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [stakeAmount, setStakeAmount] = useState('0.0')
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  const [visibleDetailedBlock, setVisibleDetailedBlock] = useState(null)
  const [allowanceEnough, setAllowanceEnough] = useState(true)
  const [inputValidity, setInputValidity] = useState(false)
  const [hoverLoaderVisible, setHoverLoaderVisible] = useState(true)

  const [modalLoaderVisible, setModalLoaderVisible] = useState(false)
  const [modalTxHash, setModalTxHash] = useState(null)
  const [modalErrorMessage, setModalErrorMessage] = useState(null)

  const [cardLoaderVisible, setCardLoaderVisible] = useState(false)
  const [cardTxHash, setCardTxHash] = useState(null)
  const [cardErrorMessage, setCardErrorMessage] = useState(null)
  const [cardPendingTxAmount, setCardPendingTxAmount] = useState(0)

  useEffect(() => {
    getData()
      .then(
        ({
          stakeDurationDays,
          yieldRate,
          stakes,
          totalStaked,
          tokensBalance,
          allowance,
        }) => {
          setHoverLoaderVisible(false)
          setStakeDurationDays(stakeDurationDays)
          setYieldRate(yieldRate)
          setStakingHistory(stakes)
          setTotalStaked(totalStaked)
          setTokensBalance(tokensBalance)
          setAllowance(allowance)
        },
      )
      .catch((err) => console.log(err))

    // Rerender component when stakes data is changed
    const checkUpdateInterval = setInterval(() => {
      getData()
        .then(({ stakes, totalStaked, tokensBalance: tokensBalanceNew }) => {
          if (tokensBalanceNew !== tokensBalance) {
            setTokensBalance(tokensBalanceNew)
          }

          if (stakingHistory) {
            for (let i = 0; i < stakes.length; i++) {
              if (!equal(stakes[i], stakingHistory[i])) {
                setStakingHistory(stakes)
                setTotalStaked(totalStaked)
                return
              }
            }
          }
        })
        .catch((err) => console.log(err))
    }, 2000)

    return () => {
      clearInterval(checkUpdateInterval)
    }
  }, [])

  useEffect(() => {
    const stakeAmountNumber = Number(stakeAmount.replaceAll(',', '.'))

    if (isNaN(stakeAmountNumber) || stakeAmountNumber <= 0) {
      setInputValidity(false)
    } else {
      setInputValidity(true)
    }

    if (!isNaN(stakeAmountNumber)) {
      setAllowanceEnough(stakeAmountNumber <= Number(allowance))
      return
    }

    setAllowanceEnough(true)
  }, [stakeAmount, allowance])

  const accordionClickHandler = (id) => {
    if (id === visibleDetailedBlock) {
      setVisibleDetailedBlock(null)
      return
    }

    setVisibleDetailedBlock(id)
  }

  const stakeAmountHandler = (e) => {
    e.preventDefault()
    setStakeAmount(e.target.value)
  }

  const approveHandler = () => {
    setModalLoaderVisible(true)
    setModalTxHash(null)
    setModalErrorMessage(null)

    approve()
      .then((tx) => {
        setModalTxHash(tx.hash)

        tx.wait()
          .then(() => {
            getData().then(({ allowance }) => {
              setModalTxHash(null)
              setModalLoaderVisible(false)
              setAllowance(allowance)
            })
          })
          .catch((err) => {
            setModalTxHash(null)
            setModalErrorMessage(String(err))
            console.log(err)
          })
      })
      .catch((err) => {
        setModalTxHash(null)
        setModalErrorMessage(String(err.message))
        console.log(err)
      })
  }

  const stakeHandler = () => {
    if (inputValidity) {
      setModalLoaderVisible(true)
      setModalTxHash(null)
      setModalErrorMessage(null)

      stake(String(stakeAmount))
        .then((tx) => {
          setModalTxHash(tx.hash)

          tx.wait()
            .then(() => {
              setModalTxHash(null)
              setIsStakeModalOpen(false)
              setModalLoaderVisible(false)
            })
            .catch((err) => {
              setModalTxHash(null)
              setModalErrorMessage(String(err))
              console.log(err)
            })
        })
        .catch((err) => {
          setModalTxHash(null)
          setModalErrorMessage(String(err.message))
          console.log(err)
        })
    }
  }

  const unstakeHandler = (staked, idx) => {
    if (staked) {
      setCardLoaderVisible(true)
      setCardTxHash(null)
      setCardErrorMessage(null)

      unstake(idx)
        .then((tx) => {
          setCardTxHash(tx.hash)
          setCardPendingTxAmount(cardPendingTxAmount + 1)

          tx.wait()
            .then(() => {
              setCardPendingTxAmount(cardPendingTxAmount - 1)

              if (cardPendingTxAmount === 0) {
                setCardTxHash(null)
                setCardLoaderVisible(false)
              }
            })
            .catch((err) => {
              setCardPendingTxAmount(cardPendingTxAmount - 1)

              if (cardPendingTxAmount === 0) {
                setCardTxHash(null)
                setCardErrorMessage(String(err))
              }
              console.log(err)
            })
        })
        .catch((err) => {
          setCardTxHash(null)
          setCardErrorMessage(String(err.message))
          console.log(err)
        })
    }
  }

  const harvestHandler = (allowHarvest, idx) => {
    if (allowHarvest) {
      setCardLoaderVisible(true)
      setCardTxHash(null)
      setCardErrorMessage(null)
      setCardPendingTxAmount(cardPendingTxAmount + 1)

      harvest(idx)
        .then((tx) => {
          setCardTxHash(tx.hash)

          tx.wait()
            .then(() => {
              setCardPendingTxAmount(cardPendingTxAmount - 1)

              setCardTxHash(null)
              setCardLoaderVisible(false)
            })
            .catch((err) => {
              setCardPendingTxAmount(cardPendingTxAmount - 1)

              if (cardPendingTxAmount === 0) {
                setCardTxHash(null)
                setCardErrorMessage(String(err))
              }
              console.log(err)
            })
        })
        .catch((err) => {
          setCardTxHash(null)
          setCardErrorMessage(String(err.message))
          console.log(err)
        })
    }
  }

  const StakingHistory = () =>
    !stakingHistory || stakingHistory.length === 0 ? (
      <div className={cardStakingListEmpty}>Empty! No information</div>
    ) : (
      stakingHistory.map(
        (
          { staked, stakedAmount, harvestable, allowHarvest, expires, details },
          idx,
        ) => {
          const isActive = visibleDetailedBlock === idx
          const hiddenClassNames = classnames(
            cardStakingItemDetails,
            cardStakingItemDetailsHide,
          )
          const detailsClassNames = isActive
            ? cardStakingItemDetails
            : hiddenClassNames
          const activeArrowClassNames = classnames(
            cardArrowButton,
            cardArrowButtonActive,
          )
          const arrowButtonClassnames = isActive
            ? activeArrowClassNames
            : cardArrowButton

          return (
            <div key={idx} className={cardStakingItem}>
              <div className={cardStakingItemHead}>
                <div className={cardStakingItemInfo}>
                  <div className={cardStakingItemInfoBlock}>
                    <div className={cardLabel}>ARES Staked</div>
                    <div className={cardInfoText}>{stakedAmount}</div>
                  </div>
                  <div className={cardStakingItemInfoBlock}>
                    <div className={cardLabel}>Harvestable</div>
                    <div className={cardInfoText}>{harvestable}</div>
                  </div>
                  <div className={cardStakingItemInfoBlock}>
                    <div className={cardLabel}>Expires</div>
                    <div className={cardInfoText}>{expires}</div>
                  </div>
                </div>
                <div className={cardStakingItemButtons}>
                  <Button
                    disabled={!allowHarvest}
                    onClick={() => harvestHandler(allowHarvest, idx)}
                    className={cardButton}
                  >
                    Harvest
                  </Button>
                  <Button
                    disabled={!staked}
                    onClick={() => unstakeHandler(staked, idx)}
                    className={cardButton}
                  >
                    Unstake
                  </Button>
                  <button
                    onClick={() => accordionClickHandler(idx)}
                    className={arrowButtonClassnames}
                  >
                    <img src={ArrowIcon} alt="Arrow" />
                  </button>
                </div>
              </div>

              <div className={detailsClassNames}>
                {details &&
                  details.map(({ name, value }, idx) => (
                    <div key={idx} className={cardStakingItemDetailsRow}>
                      <div className={cardStakingItemDetailsName}>{name}</div>
                      <div className={cardStakingItemDetailsValue}>{value}</div>
                    </div>
                  ))}
              </div>
            </div>
          )
        },
      )
    )

  const SubmitButton = () => {
    return allowanceEnough ? (
      <Button disabled={!inputValidity} onClick={stakeHandler}>
        Stake
      </Button>
    ) : (
      <Button onClick={approveHandler}>Approve</Button>
    )
  }

  return (
    <div className={cardWrapper}>
      <Modal
        isOpen={isStakeModalOpen}
        closeHandler={() => setIsStakeModalOpen(false)}
      >
        <div className={stakeModal}>
          <Title className={stakeModalTitle} level={3}>
            Stake ARES
          </Title>
          <div className={stakeModalInputContainer}>
            <Input
              onChange={stakeAmountHandler}
              value={stakeAmount}
              className={stakeModalInput}
            />
            <Button
              className={stakeModalMaxButton}
              onClick={() => {
                setStakeAmount(String(tokensBalance))
              }}
            >
              Max
            </Button>
          </div>
          {!inputValidity && (
            <span className={errorMessage}>
              Value must be a number greater than 0
            </span>
          )}

          <span className={stakeModalBalance}>Balance: {tokensBalance}</span>

          {modalLoaderVisible ? (
            <TxLoader
              txHash={modalTxHash}
              closeHandler={() => setModalLoaderVisible(false)}
              errorMessage={modalErrorMessage}
            />
          ) : (
            <SubmitButton />
          )}
        </div>
      </Modal>
      <div className={card}>
        {hoverLoaderVisible && (
          <div className={hoverLoader}>
            <Spinner />
          </div>
        )}
        <div className={cardHead}>
          <div className={cardHeadLogo}>
            <img src={DAO1Logo} alt="DAO1" />
          </div>
          <div className={cardName}>
            <span className={cardLabel}>Name</span>
            <span className={cardNameText}>
              {stakeDurationDays
                ? `ARES — FIXED ${stakeDurationDays} DAYS`
                : ''}
            </span>
          </div>
        </div>

        <div className={cardStakingConditions}>
          <div className={cardStakingConditionsItem}>
            <div className={cardLabel}>{stakeDurationDays}D yield</div>
            <div className={cardInfoText}>{yieldRate}%</div>
          </div>
          <div className={cardStakingConditionsItem}>
            <div className={cardLabel}>Daily yield</div>
            <div className={cardInfoText}>
              ~ {Number((yieldRate / stakeDurationDays).toFixed(4))}%
            </div>
          </div>
          <div className={cardStakingConditionsItem}>
            <div className={cardLabel}>Anual Compound Rate</div>
            <div className={cardInfoText}>{APY}%</div>
          </div>
          <div className={cardStakingConditionsItem}>
            <div className={cardLabel}>Duration</div>
            <div className={cardInfoText}>{stakeDurationDays} Days</div>
          </div>
        </div>

        <div className={cardStakingList}>
          {cardLoaderVisible && (
            <TxLoader
              txHash={cardTxHash}
              closeHandler={() => setCardLoaderVisible(false)}
              errorMessage={cardErrorMessage}
            />
          )}

          <StakingHistory />
        </div>

        <div className={cardFooter}>
          <div className={cardTatalStaked}>
            <div className={cardLabel}>Total Staked:</div>
            <div className={cardTatalStakedValue}>{totalStaked} ARES</div>
          </div>
          <Button
            onClick={() => setIsStakeModalOpen(true)}
            className={cardButton}
          >
            Stake
          </Button>
        </div>
      </div>
    </div>
  )
}

export const StakingCard = withFixedStakingApi(StakingCardPure)
