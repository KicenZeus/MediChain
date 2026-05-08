const crypto = require('crypto');

// ─────────────────────────────────────────
// CLASS: BLOCK
// ─────────────────────────────────────────
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index        = index;
    this.timestamp    = timestamp;
    this.data         = data;
    this.previousHash = previousHash;
    this.nonce        = 0;
    this.hash         = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`✅ Block #${this.index} mined! Hash: ${this.hash}`);
  }
}

// ─────────────────────────────────────────
// CLASS: BLOCKCHAIN
// ─────────────────────────────────────────
class Blockchain {
  constructor() {
    this.difficulty = 2;
    this.chain      = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(
      0,
      new Date().toISOString(),
      { info: 'Genesis Block — MedChain Rumah Sakit' },
      '0'
    );
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current  = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash)   return false;
    }
    return true;
  }
}

module.exports = { Block, Blockchain };