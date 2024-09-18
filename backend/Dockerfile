FROM python:3.9
WORKDIR /root/.ssh
ENV GIT_SSH_COMMAND "ssh -i /run/secrets/notebook_ssh_key -F /dev/null"
RUN ssh-keyscan github.com >> ~/.ssh/known_hosts
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./notebook /code/notebook
ENV PYTHONUNBUFFERED 1
CMD ["uvicorn", "notebook.main:app", "--host", "0.0.0.0", "--port", "8000"]
