let pools = [];

async function initializeUI() {
    try {
        showLoading();
        pools = await fetchPools();
        renderPools();
        setupAddLiquidityForm();
        setupSwapForm();
        hideLoading();
    } catch (error) {
        console.error('Error initializing UI:', error);
        showNotification('Error loading data. Please refresh the page.', 'error');
        hideLoading();
    }
}

function renderPools() {
    const poolsContainer = document.getElementById('poolsContainer');
    poolsContainer.innerHTML = '';

    pools.forEach((pool, index) => {
        const poolElement = document.createElement('div');
        poolElement.className = 'pool-card bg-card-bg shadow-md rounded-lg px-6 py-4 mb-4 transition-all duration-200 opacity-0';
        poolElement.innerHTML = `
            <h3 class="text-xl font-semibold mb-2 text-primary">${pool.name}</h3>
            <p class="text-text-color mb-2">Tokens: ${pool.tokens.join(', ')}</p>
            <p class="text-text-color mb-2">Weights: ${pool.weights.join(', ')}</p>
            <p class="text-text-color">Fee: ${pool.fee * 100}%</p>
        `;
        poolsContainer.appendChild(poolElement);
        
        setTimeout(() => {
            poolElement.style.opacity = '1';
            poolElement.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function setupAddLiquidityForm() {
    const poolSelect = document.getElementById('poolSelect');
    const tokenInputs = document.getElementById('tokenInputs');
    const addLiquiditySection = document.getElementById('addLiquidity');

    poolSelect.innerHTML = '<option value="">Select a pool</option>';
    pools.forEach(pool => {
        poolSelect.innerHTML += `<option value="${pool.id}">${pool.name}</option>`;
    });

    poolSelect.addEventListener('change', (e) => {
        const selectedPool = pools.find(pool => pool.id == e.target.value);
        if (selectedPool) {
            tokenInputs.innerHTML = '';
            selectedPool.tokens.forEach((token, index) => {
                const inputElement = document.createElement('div');
                inputElement.className = 'mb-4 opacity-0';
                inputElement.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                inputElement.style.transform = 'translateY(20px)';
                inputElement.innerHTML = `
                    <label class="block text-text-color text-sm font-bold mb-2" for="${token}Input">
                        ${token} Amount
                    </label>
                    <input class="form-input shadow appearance-none border rounded-lg w-full py-3 px-4 text-text-color leading-tight focus:outline-none focus:ring-2 focus:ring-primary" id="${token}Input" type="number" placeholder="0.0">
                `;
                tokenInputs.appendChild(inputElement);
                setTimeout(() => {
                    inputElement.style.opacity = '1';
                    inputElement.style.transform = 'translateY(0)';
                }, index * 100);
            });
            addLiquiditySection.classList.remove('hidden');
            addLiquiditySection.style.opacity = '0';
            addLiquiditySection.style.transform = 'translateY(20px)';
            setTimeout(() => {
                addLiquiditySection.style.opacity = '1';
                addLiquiditySection.style.transform = 'translateY(0)';
            }, 100);
        } else {
            addLiquiditySection.classList.add('hidden');
        }
    });

    document.getElementById('addLiquidityForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedPoolId = poolSelect.value;
        const selectedPool = pools.find(pool => pool.id == selectedPoolId);
        if (selectedPool) {
            const amounts = selectedPool.tokens.map(token => {
                const value = document.getElementById(`${token}Input`).value;
                if (!value || isNaN(value) || parseFloat(value) <= 0) {
                    throw new Error(`Please enter a valid amount for ${token}`);
                }
                return value;
            });
            await addLiquidity(selectedPoolId, amounts);
        } else {
            showNotification('Please select a pool', 'error');
        }
    });
}

function setupSwapForm() {
    const fromToken = document.getElementById('fromToken');
    const toToken = document.getElementById('toToken');

    const allTokens = [...new Set(pools.flatMap(pool => pool.tokens))];
    allTokens.forEach(token => {
        fromToken.innerHTML += `<option value="${token}">${token}</option>`;
        toToken.innerHTML += `<option value="${token}">${token}</option>`;
    });

    document.getElementById('swapForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fromTokenValue = fromToken.value;
        const toTokenValue = toToken.value;
        const amount = document.getElementById('amount').value;
        
        if (fromTokenValue === toTokenValue) {
            showNotification('Please select different tokens for swap.', 'error');
            return;
        }
        
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            showNotification('Please enter a valid amount.', 'error');
            return;
        }
        
        await swapTokens(fromTokenValue, toTokenValue, amount);
    });
}

document.addEventListener('DOMContentLoaded', initializeUI);

function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50';
    loader.innerHTML = '<div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>';
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.fixed');
    if (loader) {
        loader.remove();
    }
}

async function addLiquidity(poolId, amounts) {
    showLoading();
    try {
        await window.addLiquidity(poolId, amounts);
        showNotification('Liquidity added successfully!', 'success');
    } catch (error) {
        console.error('Error adding liquidity:', error);
        showNotification(error.message || 'Error adding liquidity. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function swapTokens(fromToken, toToken, amount) {
    showLoading();
    try {
        await window.swapTokens(fromToken, toToken, amount);
        showNotification('Swap executed successfully!', 'success');
    } catch (error) {
        console.error('Error swapping tokens:', error);
        showNotification(error.message || 'Error swapping tokens. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} transition-all duration-300 transform translate-y-full opacity-0`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateY(full)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
