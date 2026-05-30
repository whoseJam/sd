#include<bits/stdc++.h>
using namespace std;

const int N=20;
const double inf=1e10;
double x[N],y[N],f[N][1<<15];
int n;

bool contain(int S,int i){
	return (S>>i-1)&1;
}

double dist(int i,int j){
	return sqrt((x[i]-x[j])*(x[i]-x[j])+(y[i]-y[j])*(y[i]-y[j]));
}

int main(){
	scanf("%d",&n);
	for(int i=1;i<=n;i++){
		scanf("%lf%lf",&x[i],&y[i]);
	}
	int All=(1<<n)-1;
	for(int i=1;i<=n;i++)
		for(int S=1;S<=All;S++)
			f[i][S]=inf;
	for(int i=1;i<=n;i++)
		f[i][1<<i-1]=dist(0,i);
	
	for(int S=1;S<=All;S++){
		for(int i=1;i<=n;i++){
			if(!contain(S,i))continue;
			for(int j=1;j<=n;j++){
				if(contain(S,j))continue;
				int T=S|(1<<j-1);
				f[j][T]=min(f[j][T],f[i][S]+dist(i,j));
			}
		}
	}
	double ans=inf;
	for(int i=1;i<=n;i++)
		ans=min(ans,f[i][All]);
	printf("%.2lf\n",ans);
	return 0;
}
