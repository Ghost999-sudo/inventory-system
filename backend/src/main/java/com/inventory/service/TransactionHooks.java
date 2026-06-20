package com.inventory.service;

import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

// This class provides a utility method to execute a given action after the current transaction has been committed. It checks if there is an active transaction and registers a synchronization callback to run the action after the commit. If there is no active transaction, it runs the action immediately.
public final class TransactionHooks {

	private TransactionHooks() {
	}

	public static void afterCommit(Runnable action) {
		if (TransactionSynchronizationManager.isActualTransactionActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					action.run();
				}
			});
			return;
		}
		action.run();
	}
}
