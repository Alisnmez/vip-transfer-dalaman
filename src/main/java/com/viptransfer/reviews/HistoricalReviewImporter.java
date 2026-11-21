package com.viptransfer.reviews;

import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

/**
 * One-time, insert-only import of historical reviews.
 * The customer data lives in a private Render environment variable, never in Git.
 * Disabled unless HISTORICAL_REVIEWS_IMPORT_ENABLED=true.
 */
@Component
public class HistoricalReviewImporter implements ApplicationRunner {
    private final DataSource dataSource;
    private final Environment environment;

    public HistoricalReviewImporter(DataSource dataSource, Environment environment) {
        this.dataSource = dataSource;
        this.environment = environment;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!Boolean.parseBoolean(environment.getProperty("HISTORICAL_REVIEWS_IMPORT_ENABLED", "false"))) {
            return;
        }
        String script = environment.getProperty("HISTORICAL_REVIEWS_SQL", "");
        int start = script.indexOf("WITH incoming (customer_name, rating, comment, status, created_at) AS (");
        int end = script.lastIndexOf("\nCOMMIT;");
        if (start < 0 || end < 0 || end <= start) {
            throw new IllegalStateException("Historical review import SQL is missing or malformed");
        }
        String statement = script.substring(start, end).trim();
        if (!statement.endsWith(";") || !statement.contains("INSERT INTO customer_reviews ")
                || !statement.contains("WHERE NOT EXISTS (")) {
            throw new IllegalStateException("Historical review import SQL failed validation");
        }
        statement = statement.substring(0, statement.length() - 1);
        try (Connection connection = dataSource.getConnection()) {
            connection.setAutoCommit(false);
            try (Statement insert = connection.createStatement()) {
                int inserted = insert.executeUpdate(statement);
                connection.commit();
                System.out.println("Historical reviews import completed; inserted=" + inserted);
            } catch (Exception error) {
                connection.rollback();
                throw error;
            }
        }
    }
}
