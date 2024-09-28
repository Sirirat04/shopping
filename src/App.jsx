import { useState } from 'react'; 
import { products } from './data.js'; // Import products from data.js
import { getImageUrl } from './utils.js'; // Import function for images

export default function App() {
  const [card, setCard] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(''); // New state for payment status

  const shippingCost = 100; // ค่าขนส่งที่กำหนดไว้คงที่

  const coupons = [
    { code: 'DISCOUNT10', label: 'ลด 10 ฿', value: 10, type: 'fixed' },
    { code: 'DISCOUNT20', label: 'ลด 20 ฿', value: 20, type: 'fixed' },
    { code: 'DISCOUNT50', label: 'ลด 50 ฿', value: 50, type: 'fixed' },
    { code: 'DISCOUNT100', label: 'ลด 10%', value: 10, type: 'percentage' },
  ];

  function addTocard(product) {
    const productInCard = card.find((item) => item.id === product.id);
    if (productInCard) {
      setCard(
        card.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCard([...card, { ...product, quantity: 1 }]);
    }
  }

  function incrementQuantity(product) {
    setCard(
      card.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decrementQuantity(product) {
    setCard(
      card.map((item) =>
        item.id === product.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  }

  function removeFromCard(product) {
    setCard(card.filter((item) => item.id !== product.id));
  }

  function calculateTotalPrice() {
    return card.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function calculateFinalPrice() {
    const total = calculateTotalPrice();
    let finalDiscount = discount;

    if (selectedCoupon === 'DISCOUNT100') {
      finalDiscount = (10 / 100) * total;
    }

    const finalPrice = total + shippingCost - finalDiscount;
    return finalPrice > 0 ? finalPrice : 0;
  }

  function handleCouponChange(e) {
    const selectedCode = e.target.value;
    const coupon = coupons.find((c) => c.code === selectedCode);

    if (coupon) {
      setSelectedCoupon(coupon.code);
      if (coupon.type === 'percentage') {
        const total = calculateTotalPrice();
        setDiscount((coupon.value / 100) * total);
      } else {
        setDiscount(coupon.value);
      }
    } else {
      setSelectedCoupon('');
      setDiscount(0);
    }
  }

  function handlePayment() {
    setPaymentStatus('Payment Successful!'); // Set payment status on button click
    setCard([]); // Clear the cart after payment
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', position: 'relative' }}>
      {/* Section แสดงสินค้า */}
      <div style={{ width: '70%', display: 'flex', justifyContent: 'center' }}>
        <div>
          <h1 style={{ textAlign: 'center' }}>Doll Shop</h1>
          <ul
            style={{
              listStyle: 'none',
              padding: '0',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)', // แสดงสินค้า 4 คอลัมน์
              gap: '20px',
              maxWidth: '1200px',
              justifyItems: 'center',
            }}
          >
            {products.map((product) => (
              <li
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column', // ทำให้เนื้อหาเรียงเป็นคอลัมน์
                  justifyContent: 'space-between',
                  minHeight: '300px', // กำหนดความสูงขั้นต่ำเท่ากัน
                  width: '100%', // ทำให้ขนาดของกรอบสินค้าเท่ากัน
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '150px' }}>
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} // ควบคุมขนาดของรูปภาพ
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3>{product.name}</h3>
                  <p>{product.price} ฿</p>
                </div>
                <button
                  onClick={() => addTocard(product)}
                  style={{
                    backgroundColor: 'blue',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    cursor: 'pointer',
                  }}
                >
                  เพิ่มลงตะกร้า
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ปุ่มตะกร้าสินค้า */}
      <button
        className="cartButton"
        onClick={() => setDropdownVisible(!isDropdownVisible)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1002, // Ensures cart button stays above the grid
          backgroundColor: 'green',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '10%',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        🛒
        {card.length > 0 && (
          <span
            style={{
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '5px 10px',
              position: 'absolute',
              top: '-10px',
              right: '-10px',
            }}
          >
            {card.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Dropdown แสดงสินค้าในตะกร้า */}
      {isDropdownVisible && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            right: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            padding: '10px',
            zIndex: 1001, // Ensures dropdown stays above everything else
            width: '300px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {card.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                {card.map((product) => (
                  <li
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        marginRight: '10px',
                      }}
                    />
                    <div>
                      <p style={{ margin: '0' }}>{product.name}</p>
                      <p style={{ margin: '0', fontSize: '12px' }}>
                        ราคา: {product.price * product.quantity} ฿ </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ margin: '0', fontSize: '15px' }}>จำนวน:</p>
                      <button
                        onClick={() => decrementQuantity(product)}
                        style={{
                          backgroundColor: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: 'black',
                        }}
                      >
                        -
                      </button>
                      <span style={{ width: '20px', textAlign: 'center' }}>
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(product)}
                        style={{
                          backgroundColor: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: 'black',
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCard(product)}
                        style={{
                          backgroundColor: 'red',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          marginLeft: 'auto',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        ลบสินค้า
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p>ราคารวม: {calculateTotalPrice()} ฿</p>
              <p>ค่าขนส่ง: {shippingCost} ฿</p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <label style={{ marginRight: '10px' }}>เลือกคูปอง:</label>
                <select
                  value={selectedCoupon}
                  onChange={handleCouponChange}
                  style={{
                    padding: '8px',
                    width: '100%',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                  }}
                >
                  <option value="">เลือกคูปอง</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.code} value={coupon.code}>
                      {coupon.label}
                    </option>
                  ))}
                </select>
              </div>

              <p>ส่วนลด: {discount} ฿</p>
              <p>ราคาสุทธิ: {calculateFinalPrice()} ฿</p>
              <button
                onClick={handlePayment} // Call handlePayment on click
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  width: '100%',
                  cursor: 'pointer',
                }}
              >
                ชำระเงิน
              </button>

              {paymentStatus && (
                <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
                  {paymentStatus} {/* Display payment status message */}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
