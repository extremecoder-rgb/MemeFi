module meme_coin::meme_coin {
    use std::option;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    struct MEME_COIN has drop {}
    struct AdminCap has key { id: sui::object::UID }

    fun init(witness: MEME_COIN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness,
            9, 
            b"MEME", 
            b"Meme Coin", 
            b"A fun meme coin on Sui Network", 
            option::some(url::new_unsafe_from_bytes(b"https://example.com/icon.png")), // icon url
            ctx
        );

        transfer::public_transfer(treasury, tx_context::sender(ctx));
        transfer::public_transfer(metadata, tx_context::sender(ctx));
    }

    public entry fun mint(
        treasury_cap: &mut TreasuryCap<MEME_COIN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let coin = coin::mint(treasury_cap, amount, ctx);
        transfer::public_transfer(coin, recipient);
    }

    public entry fun burn(
        treasury_cap: &mut TreasuryCap<MEME_COIN>,
        coin: Coin<MEME_COIN>
    ) {
        coin::burn(treasury_cap, coin);
    }
}
