import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPurchaseInput, setShowPurchaseInput] = useState(false);
  const [shareQuantity, setShareQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(250);
  const purchaseInputRef = useRef(null);

  const generateStockData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month) => ({
      month,
      price: Math.floor(Math.random() * 200) + 50,
    }));
  };

  const get529PlanList = (handlePlanClick) => (
    <div>
      <p>Here are some of the 529 Plans you could invest in:</p>
      <ol>
        <li>
          <button onClick={() => handlePlanClick("New York's 529 College Savings Program")}>
            New York's 529 College Savings Program
          </button>
        </li>
        <li>
          <button onClick={() => handlePlanClick("Utah's my529 Plan")}>
            Utah's my529 Plan
          </button>
        </li>
      </ol>
      <p>Click on each plan to know more.</p>
    </div>
  );

  const handleSend = (event) => {
    event.preventDefault();
    const userMessage = event.target.elements.chatInput.value.trim().toLowerCase();

    if (userMessage === '') return;

    let botReply;
    let showStockData = false;
    let stockPrice = null;

    if (userMessage.includes('balance')) {
      botReply = "Your account balance is $4100";
    } else if (userMessage.includes('stock')) {
      botReply = "Below is the chart of Tesla stock price over the last month";
      showStockData = true;
      stockPrice = 250;
    } else if (userMessage.includes('529')) {
      botReply = get529PlanList(handlePlanClick); // Use function to generate stable JSX
    } else {
      botReply = "I'm sorry, I don't understand that query. Try asking about your balance, stock prices, or 529 plans.";
    }

    const newMessage = {
      id: Date.now(), // Add unique ID for stable rendering
      user: userMessage,
      bot: botReply,
      stockData: showStockData ? generateStockData() : null,
      pricePerShare: showStockData ? stockPrice : null,
      planDescription: null,
    };

    setMessages([...messages, newMessage]);
    event.target.elements.chatInput.value = '';
  };

  const handlePlanClick = (planName) => {
    let description;
    if (planName === "New York's 529 College Savings Program") {
      description = (
        <ul>
          <li>Offers tax advantages for residents.</li>
          <li>Wide range of investment options.</li>
          <li>Low fees and flexible contributions.</li>
        </ul>
      );
    } else if (planName === "Utah's my529 Plan") {
      description = (
        <ul>
          <li>Known for low fees and flexibility.</li>
          <li>Variety of investment choices.</li>
          <li>Highly rated by financial experts.</li>
        </ul>
      );
    }

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastMessageIndex = updatedMessages.length - 1;
      if (lastMessageIndex >= 0) {
        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          planDescription: description,
        };
      }
      return updatedMessages;
    });
  };

  const handleBuyClick = (price) => {
    setCurrentPrice(price);
    setShowPurchaseInput(true);
    setTimeout(() => {
      if (purchaseInputRef.current) {
        purchaseInputRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const handlePurchaseConfirm = () => {
    setShowPurchaseInput(false);
    setIsProcessing(true);
    setProgress(0);
    setShowConfirmation(false);

    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setShowConfirmation(true);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Vanguard UAI</h1>

      <div style={styles.chatWindow}>
        <div style={styles.messageContainer}>
          {messages.map((msg) => (
            <div key={msg.id} style={styles.messageBox}> {/* Use unique id as key */}
              <p style={styles.queryText}>"{msg.user}"</p>
              <div style={styles.messageText}>{msg.bot}</div>

              {msg.stockData && (
                <div style={{ marginTop: '8px' }}>
                  <h3 style={styles.chartTitle}>Stock Price Over Time</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart 
                      data={msg.stockData}
                      margin={{ top: 5, right: 20, bottom: 25, left: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: 'Month', position: 'bottom', offset: 15 }}
                      />
                      <YAxis 
                        label={{ value: 'Price ($)', angle: -90, position: 'left', offset: 0 }}
                      />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#8B0000" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={styles.priceContainer}>
                    <p style={styles.priceText}><strong>Price per share:</strong> ${msg.pricePerShare}</p>
                    <button 
                      style={styles.buyButton}
                      onClick={() => handleBuyClick(msg.pricePerShare)}
                    >
                      Buy Now
                    </button>
                  </div>

                  {showPurchaseInput && (
                    <div ref={purchaseInputRef} style={styles.purchaseInputContainer}>
                      <h3 style={styles.purchaseTitle}>Purchase Details</h3>
                      <label style={styles.label}>
                        Number of Shares:
                        <input
                          type="number"
                          min="1"
                          value={shareQuantity}
                          onChange={(e) => setShareQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          style={styles.numberInput}
                        />
                      </label>
                      <div style={styles.costBreakdown}>
                        <p style={styles.priceDetail}>
                          <span>Price per share:</span>
                          <span style={styles.priceValue}>${currentPrice.toFixed(2)}</span>
                        </p>
                        <p style={styles.priceDetail}>
                          <span>Quantity:</span>
                          <span style={styles.priceValue}>{shareQuantity}</span>
                        </p>
                        <div style={styles.totalCostContainer}>
                          <p style={styles.totalCost}>
                            <span>Total Cost:</span>
                            <span style={styles.totalValue}>${(shareQuantity * currentPrice).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                      <button 
                        style={styles.buyButton}
                        onClick={handlePurchaseConfirm}
                      >
                        Confirm Purchase
                      </button>
                    </div>
                  )}

                  {isProcessing && (
                    <div style={styles.processingContainer}>
                      <h3>Processing Purchase</h3>
                      <div style={styles.progressBarContainer}>
                        <div 
                          style={{ ...styles.progressBar, width: `${progress}%` }}
                        />
                      </div>
                      {showConfirmation && (
                        <div style={styles.confirmationMessage}>
                          Congratulations! You just bought {shareQuantity} shares of Tesla
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {msg.planDescription && (
                <div style={styles.planDescription}>
                  <h3>Plan Description</h3>
                  {msg.planDescription}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSend} style={styles.inputContainer}>
        <input
          type="text"
          name="chatInput"
          placeholder="Type your message..."
          autoComplete="off"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>

      <div style={styles.bottomStripe}></div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'white',
    color: '#333',
    position: 'relative',
  },
  heading: {
    marginBottom: '20px',
    color: '#8B0000',
    fontSize: '2.5rem',
    fontFamily: 'Times New Roman, serif',
    fontWeight: 'bold',
    letterSpacing: '-1.5px',
  },
  chatWindow: {
    width: '100%',
    height: '70vh',
    padding: '20px',
    overflowX: 'auto',
    marginBottom: '80px',
  },
  messageContainer: {
    display: 'flex',
    gap: '20px',
    minWidth: 'min-content',
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBottom: '20px',
  },
  messageBox: {
    backgroundColor: '#f6f6f6',
    padding: '12px',
    borderRadius: '5px',
    border: '3px solid #8B0000',
    minWidth: '350px',
    maxWidth: '450px',
    color: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    whiteSpace: 'pre-line',
    marginLeft: '20px',
    marginRight: '20px',
  },
  priceContainer: {
    marginTop: '8px',
    textAlign: 'center',
    padding: '8px',
    borderTop: '1px solid #666',
  },
  buyButton: {
    padding: '10px 20px',
    backgroundColor: '#8B0000',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s ease',
    marginTop: '8px',
    ':hover': { backgroundColor: '#a30d24' },
  },
  inputContainer: {
    display: 'flex',
    width: '80%',
    marginTop: '20px',
    position: 'fixed',
    bottom: '80px',
    zIndex: 1,
  },
  input: {
    flex: '1',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
    backgroundColor: 'white',
    color: '#333',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  button: {
    padding: '10px 15px',
    marginLeft: '10px',
    borderRadius: '5px',
    backgroundColor: '#8B0000',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  processingContainer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  progressBarContainer: {
    width: '100%',
    height: '20px',
    backgroundColor: '#333',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '20px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E10034',
    transition: 'width 0.2s ease-in-out',
  },
  confirmationMessage: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#004d1a',
    color: 'white',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  purchaseTitle: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
  },
  purchaseInputContainer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#333',
  },
  numberInput: {
    padding: '12px',
    borderRadius: '6px',
    border: '2px solid #C8102E',
    backgroundColor: 'white',
    color: '#333',
    fontSize: '1.1rem',
    width: '100%',
    transition: 'border-color 0.3s ease',
  },
  costBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  priceDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1rem',
    color: '#666',
    margin: '0',
  },
  priceValue: {
    fontWeight: '600',
    color: '#333',
  },
  totalCostContainer: {
    marginTop: '10px',
    padding: '15px',
    backgroundColor: '#333',
    borderRadius: '6px',
  },
  totalCost: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: '1.4rem',
    color: '#C8102E',
    fontWeight: 'bold',
  },
  queryText: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: '8px',
    borderLeft: '3px solid #8B0000',
    paddingLeft: '10px',
  },
  messageText: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
    margin: '0',
    lineHeight: '1.4',
    '& ul': { paddingLeft: '20px', marginTop: '5px', marginBottom: '5px' },
    '& li': { marginBottom: '5px' },
  },
  bottomStripe: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '60px',
    backgroundColor: '#8B0000',
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: '1.1rem',
    marginBottom: '8px',
    fontWeight: '600',
  },
  priceText: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
  },
  planDescription: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    width: '80%',
    textAlign: 'center',
  },
};

export default App;