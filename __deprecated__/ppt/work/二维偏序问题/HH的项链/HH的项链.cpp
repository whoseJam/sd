#include<bits/stdc++.h>
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

const int N=1000005;
int Prev[N],a[N],pos[N],n,m;
int ans[N];

struct Query{
	int l,r,id;
}q[N];

struct Add{
	int i,Prev;
}d[N];

bool cmpQuery(Query a,Query b){
	return a.l<b.l;
}

bool cmpAdd(Add a,Add b){
	return a.Prev<b.Prev;
}

struct TArray{
	int c[N];
	int lowbit(int x){
		return x&(-x);
	}
	void add(int x,int d){
		for(int i=x;i<=n;i+=lowbit(i))
			c[i]+=d;
	}
	int sum(int x){
		int ans=0;
		for(int i=x;i>0;i-=lowbit(i))
			ans+=c[i];
		return ans;
	}
	int sum(int l,int r){
		return sum(r)-sum(l-1);
	}
}T;

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		a[i]=read();
		Prev[i]=pos[a[i]];
		pos[a[i]]=i;
		d[i].i=i;
		d[i].Prev=Prev[i];
	}
	m=read();
	for(int i=1;i<=m;i++){
		q[i].l=read();
		q[i].r=read();
		q[i].id=i;
	}
	sort(d+1,d+1+n,cmpAdd);
	sort(q+1,q+1+m,cmpQuery);
	
	int cur=0;
	for(int i=1;i<=m;i++){
		while(cur+1<=n&&d[cur+1].Prev<q[i].l){
			cur++;
			T.add(d[cur].i,1);
		}
		ans[q[i].id]=T.sum(q[i].l,q[i].r);
	}
	for(int i=1;i<=m;i++)
		cout<<ans[i]<<'\n';
	return 0;
}

