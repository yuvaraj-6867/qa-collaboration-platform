FROM ruby:3.2.2

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libyaml-dev \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/Gemfile ./
RUN bundle install

COPY backend/ ./

RUN bundle exec rails assets:precompile

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]