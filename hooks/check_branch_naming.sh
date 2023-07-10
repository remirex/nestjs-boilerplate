#!/usr/bin/env bash

branch_name_format='(^(feature|fix|hotfix|bug)[/])|^develop|master|main'
error_msg="❌ Push not allowed, branch name should starts with feature,fix,hotfix,bug or develop,master & main"
BRANCH_NAME=$(git symbolic-ref --short HEAD)
echo "$BRANCH_NAME"
if [[ ! $BRANCH_NAME =~ $branch_name_format ]]; then
    echo "$error_msg" >&2
    echo "Below are sample branch names"
    echo "feature/<anything>"
    echo "fix/<anything>"
    echo "hotfix/<anything>"
    echo "bug/<anything>"
    echo "develop.*"
    echo "master"
    echo "main"
    exit 1
else
    echo "🎉 Push is successful ✨🚀🏄‍♂️🍻"
fi