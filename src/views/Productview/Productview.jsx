import React, { Component } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import Routeinfo from '../../components/Routeinfo/Routeinfo'
import Productslist from '../../components/Productslist/Productslist'
import products from '../../data/products'
import './Productview.scss'

class Productview extends Component {
  state = {
    products,
    currProduct: null,
    showCaseProduct: false,
    cart: {
      included: false,
      amount: 0,
    },
    noUse: null,
  }

  componentDidMount() {
    this.props.topbarEffectToggle(false)
    this.intialCall()
  }

  componentWillUnmount() {
    clearInterval(this.track)
  }

  limitProducts = (products) => {
    let limitedProducts = products.filter((prd, idx) => idx < 4)
    return limitedProducts
  }

  onIncOrDecClick = (val) => {
    const { currProduct } = this.state
    let cartItems = JSON.parse(window.localStorage.cartItems)

    if (val === 'inc') {
      if (cartItems[currProduct.id]) {
        let itemQty = cartItems[currProduct.id]
        itemQty = parseInt(itemQty) + 1
        let cartState = {
          included: true,
          amount: itemQty,
        }
        cartItems[currProduct.id] += 1
        window.localStorage.setItem('cartItems', JSON.stringify(cartItems))
        this.setState({
          cart: cartState,
        })
      } else {
        cartItems[currProduct.id] = 1
        window.localStorage.setItem('cartItems', JSON.stringify(cartItems))
        let cartState = {
          included: true,
          amount: 1,
        }
        this.setState({
          cart: cartState,
        })
      }
    } else {
      if (cartItems[currProduct.id] && cartItems[currProduct.id] > 0) {
        let itemQty = cartItems[currProduct.id]
        itemQty = parseInt(itemQty) - 1
        let cartState
        if (itemQty < 1) {
          cartState = {
            included: false,
            amount: 0,
          }
          delete cartItems[currProduct.id]
          window.localStorage.setItem('cartItems', JSON.stringify(cartItems))
        } else {
          cartState = {
            included: true,
            amount: itemQty,
          }
          cartItems[currProduct.id] -= 1
          window.localStorage.setItem('cartItems', JSON.stringify(cartItems))
        }
        this.setState({ cart: cartState })
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.prdId !== this.props.match.params.prdId) {
      clearInterval(this.track)
      this.intialCall()
    }
  }

  intialCall = () => {
    window.scroll(0, 0)
    let product = products.find(
      (prd) => prd.id.toString() === this.props.match.params.prdId.toString()
    )

    let cart
    if (JSON.parse(localStorage.cartItems)[product.id]) {
      let itemQty = JSON.parse(localStorage.cartItems)[product.id]
      cart = {
        included: true,
        amount: parseInt(itemQty),
      }
    } else {
      cart = {
        included: false,
        amount: 0,
      }
    }
    this.setState({ currProduct: product, cart })
    this.track = setInterval(() => {
      const { currProduct } = this.state
      if (JSON.parse(localStorage.cartItems)[currProduct.id]) {
        let cart = {
          included: true,
          amount: JSON.parse(localStorage.cartItems)[currProduct.id],
        }
        this.setState({ cart })
      } else {
        let cart = {
          included: false,
          amount: 0,
        }
        this.setState({ cart })
      }
    }, 1000)
  }

  toggleProductShowcase = (val) => {
    this.setState({ showCaseProduct: val })
  }

  render() {
    const { products, currProduct, showCaseProduct, cart } = this.state

    if (!currProduct) {
      return null
    }

    return (
      <div className="product-view">
        {showCaseProduct ? (
          <div className="prd-showcase">
            <OutsideClickHandler
              onOutsideClick={() => this.toggleProductShowcase(false)}
            >
              <div className="content">
                <div className="img-cont">
                  <img
                    src={require(`../../assets/img/ProductImages/${currProduct.showCaseImg}`)}
                    alt="product"
                    className="img"
                  />
                </div>
              </div>
            </OutsideClickHandler>
          </div>
        ) : null}
        <Routeinfo />
        <div className="prd-and-details">
          <div className="container">
            <div className="prd">
              <div
                onClick={() => this.toggleProductShowcase(true)}
                className="prd-img-cont"
              >
                <img
                  src={require(`../../assets/img/ProductImages/${currProduct.showCaseImg}`)}
                  alt="product"
                  className="prd-img"
                />
              </div>
            </div>
            <div className="details">
              <div className="content">
                <div className="prd-weight">WEIGHT: 350G</div>
                <h2 className="prd-name">{currProduct.name}</h2>
                <h3 className="prd-price">
                  {currProduct.rate}{' '}
                  <span className="price-info">INCL VAT</span>
                </h3>
                <div className="overview">
                  <div className="title-and-info">
                    <h3 className="title">OVERVIEW</h3>
                    <div className="info">
                      <div className="icon-cont">
                        <img
                          src={require('../../assets/icons/handshake.png')}
                          className="icon"
                          alt="handshake"
                        />
                      </div>
                      <span className="txt">LEARN ABOUT DIRECT TRADE</span>
                    </div>
                  </div>
                  <div className="detail-cont">
                    <p className="detail">
                      We have been importing this Organic coffee direct from the
                      cooperative Taramesa in the region of Sidama with our
                      colleague from Roasters United for several years now. This
                      coffee is very delicate, fruity with a fresh finish. It is
                      very interesting also in light roast for V60, aeropress,
                      etc. It is more on the blue fruits side than on the
                      espresso roast. This coffee is organic certified by
                      bio-inspecta.
                    </p>
                  </div>
                </div>
                <div className="qty-checkout">
                  <div className="text txt-big">QUANTITY:</div>
                  <div className="text txt-sm">QTY:</div>
                  <div className="item-count">{cart.amount}</div>
                  <div className="inc-dec">
                    <div
                      onClick={() => this.onIncOrDecClick('inc')}
                      className="inc"
                    >
                      <img
                        src={require('../../assets/icons/plus.png')}
                        alt="plus"
                        className="icon"
                      />
                    </div>
                    <div
                      onClick={() => this.onIncOrDecClick('dec')}
                      className="dec"
                    >
                      <img
                        src={require('../../assets/icons/subtract.png')}
                        alt="subtract"
                        className="icon"
                      />
                    </div>
                  </div>
                  <button
                    onClick={
                      !cart.included ? () => this.onIncOrDecClick('inc') : null
                    }
                    className={`cart-add ${
                      cart.included ? 'cart-add-succ' : ''
                    }`}
                  >
                    <span className="txt">
                      {cart.included ? 'ADDED TO CART' : 'ADD TO CART'}
                    </span>
                    <img
                      src={require('../../assets/icons/right-arrow.png')}
                      alt="right-arrow"
                      className="icon"
                    />
                  </button>
                </div>
                <div className="ship-info">
                  Roasts & ships from our Geneva roastery on Tuesdays
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="msg">
          <h3 className="hl">
            Our dear coffee loving customer, perhaps you would be
          </h3>
          <h2 className="main">interested in some of our amazing coffees?</h2>
        </div>
        <Productslist products={this.limitProducts(products)} />
      </div>
    )
  }
}

export default Productview
