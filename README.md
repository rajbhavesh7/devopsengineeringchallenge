# DevOps Engineering Challenge

The following describes the deploy process of a NodeJS app with MySQL using kubernetes and minikube.  
Tested with:  
Kubernetes client version: **1.19.3**  
Kubernetes server version: **1.19.2**  
Minikube version: **1.14.0**  

For MySQL the official dockerhub repo is used. For the NodeJS I used the alpine latest to build my own image, which I uploaded to dockerhub.  

The deploy procedure is as follows:  

First clone the repo with:  
```
git clone https://github.com/rajbhavesh7/devopschallengetask.git
```
I already built an image from the Dockerfile inside this directly and it is already pushed to dockerhub, thus no need to build it. The Dockerfile is left inside just for reference.  

Next we will deploy the mysql pod with the following command:  
```
kubectl apply -f mymysql-deploy.yaml
```
The deployment process can be monitored with:  
```
kubectl describe pod $(kubectl get pods |grep ^mymysql | awk '{print $1}')
```
After that we need a service for MySQL, which we start with:  
```
kubectl apply -f mymysql-service.yaml
```
A list of the currently running services can be obtained with:  
```
kubectl get services
```
Next we deploy the NodeJS application and a service for it, which will pull the image I built from DockerHUB:  
```
kubectl apply -f mynodejs-deploy.yaml
kubectl apply -f mynodejs-service.yaml
```
Now we need to populate the DB so we can retrieve from it the required string. For this we first connect to the container:  
```
kubectl exec -it $(kubectl get pods |grep ^mymysql |awk '{print $1}') sh
```
Then we connect to the MySQL database:  
```
mysql -p${MYSQL_ROOT_PASSWORD}
```
Next we create a DB, a table and an entry inside it:  
```
CREATE DATABASE IF NOT EXISTS myDB;
USE myDB;
CREATE TABLE IF NOT EXISTS myTABLE (`id` INT(11) NOT NULL AUTO_INCREMENT, `value` TEXT, PRIMARY KEY (`id`))  AUTO_INCREMENT=0;
INSERT INTO myTABLE (id,value) VALUES ('1', 'Hello World!');
```
The applicaiton is now able to query the desired resource and to do that we need to get the URL at which it is running, which can be done with:  
```
minikube service mynodejs-frontend --url
```
The URL should look like `http://192.168.2.153:31506`  where the expected result should be displayed.

