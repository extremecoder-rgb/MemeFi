module meme_coin::meme_coin {
    use std::option;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};

    /// The type identifier of the Meme coin
    struct MEME_COIN has drop {}

    /// Capability that grants permission to mint new coins
    struct AdminCap has key { id: sui::object::UID }

    /// Module initializer is called once on module publish
    fun init(witness: MEME_COIN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness,
            9, // decimals
            b"MEME", // symbol
            b"Meme Coin", // name
            b"A fun meme coin on Sui Network", // description
            option::some(url::new_unsafe_from_bytes(b"https://example.com/icon.png")), // icon url
            ctx
        );

        // Transfer the treasury capability to the module publisher
        transfer::public_transfer(treasury, tx_context::sender(ctx));
        // Transfer the metadata object to the module publisher
        transfer::public_transfer(metadata, tx_context::sender(ctx));
    }

    /// Mint new coins
    public entry fun mint(
        treasury_cap: &mut TreasuryCap<MEME_COIN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let coin = coin::mint(treasury_cap, amount, ctx);
        transfer::public_transfer(coin, recipient);
    }

    /// Burn coins
    public entry fun burn(
        treasury_cap: &mut TreasuryCap<MEME_COIN>,
        coin: Coin<MEME_COIN>
    ) {
        coin::burn(treasury_cap, coin);
    }
}