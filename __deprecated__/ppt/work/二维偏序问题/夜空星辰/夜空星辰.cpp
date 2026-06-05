#include<iostream>
#include<cmath>
#include<algorithm>
#include<cstdio>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=100005;
int n,c[N],ans[N];

struct stars{
	int x,y;
}s[N];

bool cmp(stars a,stars b){
	if(a.x!=b.x)return a.x<b.x;
	return a.y<b.y;
}

int lowbit(int x){
	return x&(-x);
}

void add(int x,int d){
	for(int i=x;i<N;i+=lowbit(i))
		c[i]+=d;
}

int sum(int x){
	int ans=0;
	for(int i=x;i>0;i-=lowbit(i))
		ans+=c[i];
	return ans;
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		s[i].x=read()+1;
		s[i].y=read()+1;
	}
	sort(s+1,s+1+n,cmp);
	for(int i=1;i<=n;i++){
		int level=sum(s[i].y);
		ans[level]++;
		add(s[i].y,1);
	}
	
	for(int i=0;i<n;i++){
		printf("%d\n",ans[i]);
	}
	return 0;
}
