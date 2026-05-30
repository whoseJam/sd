#include<iostream>
#include<cstdio>
#include<cmath>
using namespace std;

const int N=155;
const double INF=1e10;
double dist[N][N],d[N],s[N],x[N],y[N];
double withLink=INF;
int n,prt[N];

double getDist(int a,int b){
	return sqrt((x[a]-x[b])*(x[a]-x[b])+(y[a]-y[b])*(y[a]-y[b]));
}

double max(double a,double b,double c){
	return max(max(a,b),c);
}

int getPrt(int k){
	if(prt[k]==k)return k;
	prt[k]=getPrt(prt[k]);
	return prt[k];
}

int main(){
	cin>>n;
	for(int i=1;i<=n;i++)cin>>x[i]>>y[i],prt[i]=i;
	char tmp;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			if(i!=j)dist[i][j]=INF;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++){
			cin>>tmp;
			if(tmp=='1'){
				dist[i][j]=getDist(i,j);
				int p1=getPrt(i),p2=getPrt(j);
				if(p1!=p2)prt[p1]=p2;
			}
		}
	for(int k=1;k<=n;k++)
		for(int i=1;i<=n;i++)
			for(int j=1;j<=n;j++)
				dist[i][j]=min(dist[i][j],dist[i][k]+dist[k][j]);
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			if(getPrt(i)==getPrt(j)){
				s[i]=max(s[i],dist[i][j]);
				d[getPrt(i)]=max(d[getPrt(i)],dist[i][j]);
			}
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			if(getPrt(i)!=getPrt(j))withLink=min(withLink,max(d[getPrt(i)],d[getPrt(j)],getDist(i,j)+s[i]+s[j]));
	printf("%.6lf",withLink);
	return 0;
}
