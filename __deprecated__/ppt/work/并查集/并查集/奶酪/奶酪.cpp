#include<iostream>
#include<cstring>
#include<cstdio>
#define LL long long
using namespace std;

int T;
int prt[1005],n,s,t;
LL h,r,x[1005],y[1005],z[1005];

int getPrt(int k)
{
	if(k==prt[k])return k;
	return prt[k]=getPrt(prt[k]);
}

void Merge(int x,int y)
{
	int fx=getPrt(x),fy=getPrt(y);
	if(fx!=fy)prt[fx]=fy;
}

LL Pow(LL x)
{return x*x;}

int main()
{
	scanf("%d",&T);
	while(T--)
	{
		scanf("%d%lld%lld",&n,&h,&r);
		for(int i=1;i<=n+2;i++)prt[i]=i;
		s=n+1;t=n+2;
		for(int i=1;i<=n;i++)
		{
			scanf("%lld%lld%lld",&x[i],&y[i],&z[i]);
			if(z[i]<=r)Merge(s,i);
			if(h-z[i]<=r)Merge(i,t);
			for(int j=1;j<=i-1;j++)
				if(Pow(x[i]-x[j])+Pow(y[i]-y[j])+Pow(z[i]-z[j])<=Pow(2*r))Merge(i,j);
		}
		if(getPrt(s)==getPrt(t))printf("Yes\n");
		else printf("No\n");
	}
	return 0;
}
