const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const mongoose = require("mongoose");

async function createAccountController(req, res) {

    const user = req.user;

    try {
        const account = await accountModel.create({ user: user._id });

        // Create an initial deposit transaction
        const transaction = await transactionModel.create({
            fromAccount: account._id, // Use self as fromAccount to satisfy schema
            toAccount: account._id,
            amount: 100,
            status: "COMPLETED",
            idempotencyKey: `INIT_FUND_${account._id.toString()}`
        });

        // Create only a CREDIT ledger entry to effectively add balance
        await ledgerModel.create({
            account: account._id,
            amount: 100,
            transaction: transaction._id,
            type: "CREDIT"
        });

        res.status(201).json({
            account
        });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ message: "Failed to create account" });
    }
}

async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

async function updateAccountStatusController(req, res) {
    const { accountId } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "FROZEN", "CLOSED"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    });

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    account.status = status;
    await account.save();

    res.status(200).json({
        message: `Account status updated to ${status}`,
        account
    });
}


module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController,
    updateAccountStatusController
}